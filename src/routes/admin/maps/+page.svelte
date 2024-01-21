<script lang="ts">
	// import { getBuildings } from '$lib/queries/buildingQueries';
	import AdminBuildingSelector from '$components/MapComponents/AdminBuildingSelector.svelte';
	import AdminFloorSelector from '$components/MapComponents/AdminFloorSelector.svelte';
	import AdminSerachbar from '$components/MapComponents/AdminSerachbar.svelte';
	import MapObjectComponent from '$components/MapComponents/MapObjectComponent.svelte';
	import MapObjectSelector from '$components/MapComponents/MapObjectSelector.svelte';
	import {
		CachePolicy,
		graphql,
		type UpdateDeskInput,
		type UpdateDoorInput,
		type UpdateLabelInput,
		type UpdateRoomInput,
		type UpdateWallInput
	} from '$houdini';
	import { compareObjectsByValues } from '$lib/map/helper';

	import {
		defaultMapProps,
		deskProps,
		doorProps,
		getInputTypeFromMapObject,
		getTransformFromType,
		labelProps,
		mapObjectType,
		panzoomProps,
		roomProps,
		wallProps
	} from '$lib/map/props';
	import { deleteDesks, updateDesksOnMap } from '$lib/mutations/desks';
	import { deleteDoors, updateDoorsOnMap } from '$lib/mutations/door';
	import { deleteLabels, updateLabelsOnMap } from '$lib/mutations/label';
	import { createMap, updateMap } from '$lib/mutations/map';
	import { deleteRooms, updateRoomsOnMap } from '$lib/mutations/room';
	import { deleteWalls, updateWallsOnMap } from '$lib/mutations/wall';
	import { getMapByFloor } from '$lib/queries/map';
	import { map } from '$lib/stores/mapCreationStore';
	import { allMapObjects, selectedMapObject } from '$lib/stores/mapObjectStore';
	import type { MapObject } from '$lib/types/mapObjectTypes';
	import {
		maxBottomTransform,
		maxLeftTransform,
		maxRightTransform,
		maxTopTransform,
		type TransformType
	} from '$lib/types/transformType';
	import { user } from '$lib/userStore';
	import { getModalStore, ProgressBar, type ModalSettings, filter } from '@skeletonlabs/skeleton';
	import panzoom, { type PanZoom } from 'panzoom';
	import { onDestroy, onMount } from 'svelte';

	let grid: HTMLElement;
	let main: HTMLElement;
	let container: HTMLElement;

	let canvas: HTMLCanvasElement;
	let panz: PanZoom;

	let mapObjects: { [key: string]: MapObjectComponent } = {};

	let currentBuildingID: string = '';
	let currentFloorID: string = '';
	let loadingMap: boolean = false;

	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'component',
		component: 'modalEditMapObject',
		response: (r: { newId: string; oldId: string }) => {
			if (!r) return;
			changeMapObjectId(r.oldId, r.newId);
		}
	};

	const getBuildings = graphql(`
		query GetBuildings($floorId: ID!) {
			getBuildingsInLocation(locationid: $floorId) {
				pk_buildingid
				buildingname
				floors {
					pk_floorid
					floorname
				}
			}
		}
	`);

	$: mapData = $getMapByFloor.data?.getMapByFloor;

	$: $map.height = mapData?.height ?? defaultMapProps.height;
	$: $map.width = mapData?.width ?? defaultMapProps.width;

	$: currentFloor = $getMapByFloor.data?.getMapByFloor?.floor;

	const locationIdVienna: string = $user.location?.pk_locationid!; //TODO: get from admin user
	$: buildings = $getBuildings.data?.getBuildingsInLocation ?? [];

	const fetchBuildings = async (id: string) => {
		await getBuildings.fetch({ variables: { floorId: id } });
	};

	onMount(() => {
		initializeMap();
		panz = panzoom(grid, {
			...panzoomProps
		});
		panz.on('zoom', (e: PanZoom) => {
			$map.scale = e.getTransform().scale;
		});

		recenterMap();

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('mousedown', handleMouseDown);
	});

	onDestroy(() => {
		if (!panz || !window) return;

		panz.dispose();
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('mousedown', handleMouseDown);
	});

	const changeMapObjectId = (oldId: string, newId: string) => {
		if (!oldId || !newId) return;
		const mapObject: MapObject = $allMapObjects.find((obj) => obj.id === oldId)!;
		mapObjects[newId] = mapObjects[oldId];
		delete mapObjects[oldId];
		mapObject.id = newId;
		mapObjects[newId].rerenderMapObject();
	};

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Delete') {
			removeMapObject();
		}
	};

	const handleMouseDown = (event: MouseEvent) => {
		if (event.target === canvas) {
			resetSelectedMapObjectStyle();
			$selectedMapObject = null;
		}
	};

	const initializeMap = async () => {
		await fetchBuildings(locationIdVienna);
		await changeBuilding(buildings[0].pk_buildingid, buildings[0].floors![0].pk_floorid);
	};

	const recenterMap = (smooth: boolean = false, offsetX: number = 0, offsetY: number = 0) => {
		if (!smooth)
			panz.moveTo(
				window.innerWidth / 2 - ($map.width / 2 + offsetX) / $map.scale,
				window.innerHeight / 2 - ($map.height / 2 + offsetY) / $map.scale
			);
		else
			panz.smoothMoveTo(
				window.innerWidth / 2 - ($map.width / 2 + offsetX) * $map.scale,
				window.innerHeight / 2 - ($map.height / 2 + offsetY) * $map.scale
			);
	};

	const removeMapObject = () => {
		if (!$selectedMapObject) {
			return;
		}
		delSelectedMapObject();
	};

	const createMapObject = (
		event: MouseEvent,
		type: string,
		initialTransform: TransformType | null,
		id: string = '',
		dbID: string | null = null,
		text: string = ''
	) => {
		resetSelectedMapObjectStyle();
		let mapObject: MapObject = {
			dbID: dbID,
			id: id === '' ? genRandomId(type) : id,
			type: type,
			transform: { ...(initialTransform == null ? getTransformFromType(type) : initialTransform) },
			text: text
		};

		if (initialTransform == null) {
			mapObject.transform.x = event.clientX - main.getBoundingClientRect().left;
			mapObject.transform.y = event.clientY - main.getBoundingClientRect().top;
		}

		const element = new MapObjectComponent({
			target: initialTransform == null ? main : grid,
			props: {
				mapObject: mapObject,
				// enabled: initialTransform != null,
				target: grid,
				main: main,
				drawer: container,
				initMouseX: event.clientX,
				initMouseY: event.clientY,
				initialDrag: initialTransform == null
			}
		});
		if (initialTransform) element.removeSelectedStyle();

		element.$on('select', (event: CustomEvent<TransformType>) => {
			panz.pause();
			resetSelectedMapObjectStyle();
			selectMapObject($allMapObjects.find((mapObject) => mapObject.transform === event.detail)!);
		});

		element.$on('resetSelection', (event: CustomEvent<void>) => {
			resetSelectedMapObjectStyle();
			$selectedMapObject = null;
		});

		// enabled: boolean
		element.$on('release', (event: CustomEvent<{ transform: TransformType }>) => {
			panz.resume();
			// if (!event.detail.enabled) {
			// 	delSelectedMapObject();
			// 	return;
			// }
			resizeGrid(event.detail.transform);
			normalizeGridSize();
			rerenderObjects();
		});

		element.$on('openModal', (event: CustomEvent<MapObject>) => {
			selectMapObject(event.detail);
			modalStore.trigger(modal);
		});

		if (initialTransform == null) {
			panz.pause();
		}
		$selectedMapObject = initialTransform == null ? mapObject : null;
		$allMapObjects.push(mapObject);
		mapObjects[mapObject.id] = element;
	};

	const genRandomId = (type: string) => {
		let result: string = '';
		if (type !== mapObjectType.Desk) {
			while ($allMapObjects.find((obj) => obj.id === result)) {
				result = type + Math.random() * 100000;
			}
			return result;
		}

		result += currentFloor?.building?.buildingname[0].toUpperCase();
		result += currentFloor?.floorname[0].toUpperCase();
		let num: number = $allMapObjects.filter((obj) => obj.type === mapObjectType.Desk).length + 1;

		while ($allMapObjects.find((obj) => obj.id === result + num)) {
			num++;
		}

		result += num;

		return result;
	};

	const selectMapObject = (obj: MapObject) => {
		resetSelectedMapObjectStyle();
		$selectedMapObject = obj;
		mapObjects[obj.id].applySelectedStyle();
	};

	//x and y are in local space of the parent element
	const resizeGrid = (transform: TransformType) => {
		let panzOffsetX: number = 0;
		let panzOffsetY: number = 0;
		const x: number = transform.x;
		const y: number = transform.y;

		const objW = transform.width;
		const objH = transform.height;

		if (x < 0 + defaultMapProps.border) {
			$map.width += (x > 0 ? x : Math.abs(x)) + defaultMapProps.border;
			panzOffsetX = x - defaultMapProps.border;
		} else if (x > $map.width - (defaultMapProps.border + objW)) {
			$map.width += x - $map.width + objW + defaultMapProps.border;
		}
		if (y < 0 + defaultMapProps.border) {
			$map.height += (y > 0 ? -y : Math.abs(y)) + defaultMapProps.border;
			panzOffsetY = y - defaultMapProps.border;
		} else if (y > $map.height - (defaultMapProps.border + objH)) {
			$map.height += y - $map.height + objH + defaultMapProps.border;
		}

		if (panzOffsetX !== 0 || panzOffsetY !== 0) {
			$allMapObjects.map((mapObject) => {
				mapObject.transform.x -= panzOffsetX;
				mapObject.transform.y -= panzOffsetY;
			});
		}
		panz.moveTo(
			panz.getTransform().x + panzOffsetX * $map.scale,
			panz.getTransform().y + panzOffsetY * $map.scale
		);
	};

	const normalizeGridSize = () => {
		if ($allMapObjects.length === 0) {
			$map.width = defaultMapProps.width;
			$map.height = defaultMapProps.height;
			return;
		}

		let left: TransformType = { ...maxLeftTransform };
		let right: TransformType = { ...maxRightTransform };
		let top: TransformType = { ...maxTopTransform };
		let bottom: TransformType = { ...maxBottomTransform };
		$allMapObjects.map((mapObject) => {
			if (mapObject.transform.x! < left.x) left = { ...mapObject.transform };
			if (mapObject.transform.y! < top.y) top = { ...mapObject.transform };
		});

		let horizontalOffset: number = 0;
		let verticalOffset: number = 0;

		let mapWidth: number = defaultMapProps.width;
		let mapHeight: number = defaultMapProps.height;

		if (
			left.x > defaultMapProps.maxHorizontalDist ||
			(left.x > defaultMapProps.border &&
				left.x < defaultMapProps.border + ($map.width - defaultMapProps.width))
		) {
			horizontalOffset = -left.x + defaultMapProps.border;
		}
		if (
			top.y > defaultMapProps.maxVerticalDist ||
			(top.y > defaultMapProps.border &&
				top.y < defaultMapProps.border + ($map.height - defaultMapProps.width))
		) {
			verticalOffset = -top.y + defaultMapProps.border;
		}

		$allMapObjects.map((mapObject) => {
			mapObject.transform.x += horizontalOffset;
			mapObject.transform.y += verticalOffset;
			if (mapObject.transform.y! + mapObject.transform.height > bottom.y + right.height)
				bottom = { ...mapObject.transform };
			if (mapObject.transform.x! + mapObject.transform.width > right.x + right.width)
				right = { ...mapObject.transform };
		});

		if (right.x > defaultMapProps.width - (defaultMapProps.border + right.width)) {
			mapWidth = right.x + right.width + defaultMapProps.border;
		}
		if (bottom.y > defaultMapProps.height - (defaultMapProps.border + bottom.height)) {
			mapHeight = bottom.y + bottom.height + defaultMapProps.border;
		}

		panz.moveTo(
			panz.getTransform().x - horizontalOffset * $map.scale,
			panz.getTransform().y - verticalOffset * $map.scale
		);

		$map.height = mapHeight;
		$map.width = mapWidth;
	};

	const rerenderObjects = () => {
		for (const [, value] of Object.entries(mapObjects)) {
			value.rerenderMapObject();
		}
	};

	const delSelectedMapObject = () => {
		$allMapObjects = $allMapObjects.filter((mapObject) => mapObject.id !== $selectedMapObject!.id);
		mapObjects[$selectedMapObject!.id].$destroy();
		delete mapObjects[$selectedMapObject!.id];
		$selectedMapObject = null;
		normalizeGridSize();
		rerenderObjects();
	};

	const resetSelectedMapObjectStyle = () => {
		if (!$selectedMapObject) return;
		mapObjects[$selectedMapObject.id].removeSelectedStyle();
	};

	const zoomToObjectId = (id: string) => {
		if (!mapObjects[id]) return;
		const obj: MapObject = $allMapObjects.find((obj) => obj.id === id)!;
		const transform: TransformType = obj.transform;
		selectMapObject(obj);
		let longerSide: number = Math.max(transform.width, transform.height);
		panz.zoomAbs(window.innerWidth / 2, window.innerHeight / 2, 3 * (400 / longerSide));
		recenterMap(
			true,
			-($map.width / 2) + transform.x + transform.width / 2,
			-($map.height / 2) + transform.y + transform.height / 2
		);
	};

	const changeBuilding = async (buildingID: string, customFloorID: string | null) => {
		if (buildingID === currentBuildingID) return;
		currentBuildingID = buildingID;
		let floorID: string =
			customFloorID ??
			buildings.filter((b) => b.pk_buildingid === buildingID)[0]?.floors![0].pk_floorid;
		await changeFloor(floorID);
		buildings = buildings;
	};

	const changeFloor = async (floorID: string) => {
		if (floorID === currentFloorID) return;
		emptyMap();
		await getMapByFloor.fetch({ variables: { floorID: floorID }, policy: CachePolicy.NetworkOnly });
		drawMap();
		currentFloorID = floorID;
	};

	const createNewMap = async (floorID: string) => {
		const newMap = await createMap.mutate({
			floorId: floorID,
			mapInput: { height: defaultMapProps.height, width: defaultMapProps.height }
		});

		if (newMap.errors) return console.error(newMap.errors);
		if (!newMap.data?.createMap) return;

		panz.zoomAbs(0, 0, 1);
		await getMapByFloor.fetch({ variables: { floorID: floorID }, policy: CachePolicy.NetworkOnly });
		recenterMap();
	};

	const emptyMap = () => {
		$allMapObjects = [];
		$selectedMapObject = null;
		$map.height = defaultMapProps.height;
		$map.width = defaultMapProps.width;
		for (const [, value] of Object.entries(mapObjects)) {
			value.$destroy();
		}
		mapObjects = {};
	};

	const drawMap = (recenter: boolean = true) => {
		emptyMap();
		if (!mapData) {
			return;
		}

		$map.height = mapData.height;
		$map.width = mapData.width;
		panz.zoomAbs(0, 0, 1);

		mapData.desks!.map((desk) => {
			createMapObject(
				{ clientX: desk.x, clientY: desk.y } as MouseEvent,
				mapObjectType.Desk,
				{
					x: desk.x,
					y: desk.y,
					width: deskProps.width,
					height: deskProps.height,
					rotation: desk.rotation
				} as TransformType,
				desk.desknum,
				desk.pk_deskid
			);
		});
		mapData.doors!.map((door) => {
			createMapObject(
				{ clientX: door.x, clientY: door.y } as MouseEvent,
				mapObjectType.Door,
				{
					x: door.x,
					y: door.y,
					width: door.width,
					height: doorProps.height,
					rotation: door.rotation
				} as TransformType,
				'',
				door.pk_doorId
			);
		});
		mapData.rooms!.map((room) => {
			createMapObject(
				{ clientX: room.x, clientY: room.y } as MouseEvent,
				mapObjectType.Room,
				{
					x: room.x,
					y: room.y,
					width: room.width,
					height: room.height,
					rotation: roomProps.rotation
				} as TransformType,
				'',
				room.pk_roomId
			);
		});
		mapData.walls!.map((wall) => {
			createMapObject(
				{ clientX: wall.x, clientY: wall.y } as MouseEvent,
				mapObjectType.Wall,
				{
					x: wall.x,
					y: wall.y,
					width: wall.width,
					height: wallProps.height,
					rotation: wall.rotation
				} as TransformType,
				'',
				wall.pk_wallId
			);
		});
		mapData.labels!.map((label) => {
			createMapObject(
				{ clientX: label.x, clientY: label.y } as MouseEvent,
				mapObjectType.Label,
				{
					x: label.x,
					y: label.y,
					width: labelProps.width,
					height: labelProps.height,
					rotation: label.rotation
				} as TransformType,
				'',
				label.pk_labelId,
				label.text
			);
		});
		if (recenter) recenterMap();
		$allMapObjects = $allMapObjects;
		mapObjects = mapObjects;
	};

	const saveMap = async () => {
		if (mapData == null) return;
		
		resetSelectedMapObjectStyle();
		$selectedMapObject = null;

		const desks: UpdateDeskInput[] = $allMapObjects
			.filter((obj) => obj.type === mapObjectType.Desk)
			.map((obj) => {
				const desk = mapData!.desks?.find((d) => d.pk_deskid === obj.dbID);
				if (
					compareObjectsByValues(
						{ dbID: obj.dbID, id: obj.id, x: obj.transform.x, y: obj.transform.y },
						{ dbID: desk?.pk_deskid, id: desk?.desknum, x: desk?.x, y: desk?.y }
					)
				)
					return {} as UpdateDeskInput;
				return getInputTypeFromMapObject(obj) as UpdateDeskInput;
			})
			.filter((desk) => Object.keys(desk).length !== 0);

		const rooms: UpdateRoomInput[] = $allMapObjects
			.filter((obj) => obj.type === mapObjectType.Room)
			.map((obj) => {
				const room = mapData!.rooms?.find((d) => d.pk_roomId === obj.dbID);
				if (
					compareObjectsByValues(
						{
							dbID: obj.dbID,
							x: obj.transform.x,
							y: obj.transform.y,
							width: obj.transform.width,
							height: obj.transform.height
						},
						{
							dbID: room?.pk_roomId,
							x: room?.x,
							y: room?.y,
							width: room?.width,
							height: room?.height
						}
					)
				)
					return {} as UpdateRoomInput;
				return getInputTypeFromMapObject(obj) as UpdateRoomInput;
			})
			.filter((room) => Object.keys(room).length !== 0);

		const walls: UpdateWallInput[] = $allMapObjects
			.filter((obj) => obj.type === mapObjectType.Wall)
			.map((obj) => {
				const wall = mapData!.walls?.find((d) => d.pk_wallId === obj.dbID);
				if (
					compareObjectsByValues(
						{
							dbID: obj.dbID,
							x: obj.transform.x,
							y: obj.transform.y,
							rotation: obj.transform.rotation,
							width: obj.transform.width
						},
						{
							dbID: wall?.pk_wallId,
							x: wall?.x,
							y: wall?.y,
							rotation: wall?.rotation,
							width: wall?.width
						}
					)
				)
					return {} as UpdateWallInput;
				return getInputTypeFromMapObject(obj) as UpdateWallInput;
			})
			.filter((wall) => Object.keys(wall).length !== 0);

		const doors: UpdateDoorInput[] = $allMapObjects
			.filter((obj) => obj.type === mapObjectType.Door)
			.map((obj) => {
				const door = mapData!.doors?.find((d) => d.pk_doorId === obj.dbID);
				if (
					compareObjectsByValues(
						{
							dbID: obj.dbID,
							x: obj.transform.x,
							y: obj.transform.y,
							rotation: obj.transform.rotation,
							width: obj.transform.width
						},
						{
							dbID: door?.pk_doorId,
							x: door?.x,
							y: door?.y,
							rotation: door?.rotation,
							width: door?.width
						}
					)
				)
					return {} as UpdateDoorInput;
				return getInputTypeFromMapObject(obj) as UpdateDoorInput;
			})
			.filter((door) => Object.keys(door).length !== 0);

		const labels: UpdateLabelInput[] = $allMapObjects
			.filter((obj) => obj.type === mapObjectType.Label)
			.map((obj) => {
				const label = mapData!.labels?.find((d) => d.pk_labelId === obj.dbID);
				if (
					compareObjectsByValues(
						{
							dbID: obj.dbID,
							x: obj.transform.x,
							y: obj.transform.y,
							rotation: obj.transform.rotation,
							text: obj.text
						},
						{
							dbID: label?.pk_labelId,
							x: label?.x,
							y: label?.y,
							rotation: label?.rotation,
							text: label?.text
						}
					)
				)
					return {} as UpdateLabelInput;
				return getInputTypeFromMapObject(obj) as UpdateLabelInput;
			})
			.filter((label) => Object.keys(label).length !== 0);

		const deskIdsToDelete: string[] =
			mapData.desks
				?.filter(
					(desk) =>
						!$allMapObjects?.find((d) => d.dbID === desk.pk_deskid && d.type === mapObjectType.Desk)
				)
				?.map((desk) => desk.pk_deskid) ?? [];
		const roomIdsToDelete: string[] =
			mapData.rooms
				?.filter(
					(room) =>
						!$allMapObjects?.find((d) => d.dbID === room.pk_roomId && d.type === mapObjectType.Room)
				)
				?.map((room) => room.pk_roomId) ?? [];
		const doorIdsToDelete: string[] =
			mapData.doors
				?.filter(
					(door) =>
						!$allMapObjects?.find((d) => d.dbID === door.pk_doorId && d.type === mapObjectType.Door)
				)
				?.map((door) => door.pk_doorId) ?? [];
		const wallIdsToDelete: string[] =
			mapData.walls
				?.filter(
					(wall) =>
						!$allMapObjects?.find((d) => d.dbID === wall.pk_wallId && d.type === mapObjectType.Wall)
				)
				?.map((wall) => wall.pk_wallId) ?? [];
		const labelsToDelete: string[] =
			mapData.labels
				?.filter(
					(label) =>
						!$allMapObjects?.find(
							(d) => d.dbID === label.pk_labelId && d.type === mapObjectType.Label
						)
				)
				?.map((label) => label.pk_labelId) ?? [];

		let updateDesks;
		if (desks.length > 0) {
			updateDesks = updateDesksOnMap.mutate({
				mapId: mapData.pk_mapId,
				deskInputs: desks
			});
		}

		let updateRooms;
		if (rooms.length > 0) {
			updateRooms = updateRoomsOnMap.mutate({
				mapId: mapData.pk_mapId,
				roomInputs: rooms
			});
		}

		let updateWalls;
		if (walls.length > 0) {
			updateWalls = updateWallsOnMap.mutate({
				mapId: mapData.pk_mapId,
				wallInputs: walls
			});
		}

		let updateDoors;
		if (doors.length > 0) {
			updateDoors = updateDoorsOnMap.mutate({
				mapId: mapData.pk_mapId,
				doorInputs: doors
			});
		}

		let updateLabels;
		if (labels.length > 0) {
			updateLabels = updateLabelsOnMap.mutate({
				mapId: mapData.pk_mapId,
				labelInputs: labels
			});
		}

		let mapUpdate = updateMap.mutate({
			mapId: mapData.pk_mapId,
			mapInput: {
				height: $map.height,
				width: $map.width
			}
		});

		let delDesks;
		if (deskIdsToDelete?.length > 0) {
			delDesks = deleteDesks.mutate({
				deskIds: deskIdsToDelete
			});
		}

		let delRooms;
		if (roomIdsToDelete?.length > 0) {
			delRooms = deleteRooms.mutate({
				roomIds: roomIdsToDelete
			});
		}

		let delDoors;
		if (doorIdsToDelete?.length > 0) {
			delDoors = deleteDoors.mutate({
				doorIds: doorIdsToDelete
			});
		}

		let delWalls;
		if (wallIdsToDelete?.length > 0) {
			delWalls = deleteWalls.mutate({
				wallIds: wallIdsToDelete
			});
		}

		let delLabels;
		if (labelsToDelete?.length > 0) {
			delLabels = deleteLabels.mutate({
				labelIds: labelsToDelete
			});
		}

		const resolves = await Promise.all([
			updateDesks,
			updateRooms,
			updateWalls,
			updateDoors,
			updateLabels,
			mapUpdate,
			delDesks,
			delRooms,
			delDoors,
			delWalls,
			delLabels
		]);

		resolves.map((resolve) => {
			if (!resolve) return;
			if (resolve.errors) return console.error(resolve.errors);
		});

		const receivedMap = await getMapByFloor.fetch({
			variables: { floorID: currentFloorID },
			policy: CachePolicy.NetworkOnly
		});

		$allMapObjects = $allMapObjects.map((obj) => {
			obj.dbID =
				receivedMap.data?.getMapByFloor?.desks?.find((d) => d.desknum === obj.id)?.pk_deskid ??
				obj.dbID;
			return obj;
		});
	};
</script>

<main bind:this={main} class="overflow-hidden h-full">
	<!--temporarily-->
	<a href="/" class="btn variant-filled-primary absolute z-[100] m-2">MAP</a>
	<!---->
	<button
		on:click={saveMap}
		class="absolute left-1/2 -translate-x-1/2 bottom-24 btn variant-filled-primary rounded-full w-24 z-[100]"
		>{$getMapByFloor.fetching ? 'loading' : 'SAVE'}</button
	>
	<MapObjectSelector
		on:create={(event) => {
			createMapObject(event.detail.e, event.detail.type, null);
			$allMapObjects = $allMapObjects;
			mapObjects = mapObjects;
		}}
	/>
	<AdminBuildingSelector
		on:changeBuilding={(event) => changeBuilding(event.detail, null)}
		{buildings}
	/>
	<AdminFloorSelector
		on:changeFloor={(event) => changeFloor(event.detail)}
		floors={buildings.filter((b) => b.pk_buildingid === currentBuildingID)[0]?.floors ?? []}
	/>
	<AdminSerachbar
		names={$allMapObjects.filter(o => o.type === mapObjectType.Desk).map((o) => o.id)}
		on:selected={(event) => zoomToObjectId(event.detail)}
	/>
	<div bind:this={container} class="overflow-hidden h-full">
		<div
			bind:this={grid}
			role="grid"
			tabindex="0"
			style="width: {$map.width}px; height: {$map.height}px;"
			class="z-0"
		>
			{#if $getMapByFloor.fetching}
				<div class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-1/6">
					<ProgressBar value={undefined} />
				</div>
			{:else if mapData}
				<canvas
					bind:this={canvas}
					width={$map.width}
					height={$map.height}
					draggable="false"
					class="canvasStyle"
				/>
			{/if}
		</div>
	</div>
	{#if !$getMapByFloor.fetching && !mapData}
		<button
			class="absolute btn variant-filled-primary left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"
			on:click={() => createNewMap(currentFloorID)}>CREATE NEW MAP</button
		>
	{/if}
</main>

<style>
	@import 'tailwindcss/base';
	@import 'tailwindcss/components';
	@import 'tailwindcss/utilities';
</style>
