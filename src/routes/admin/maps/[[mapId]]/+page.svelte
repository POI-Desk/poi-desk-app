<script lang="ts">
	import { goto } from '$app/navigation';

	// import { getBuildings } from '$lib/queries/buildingQueries';
	import AdminSerachbar from '$components/MapComponents/AdminSerachbar.svelte';
	import MapObjectComponent from '$components/MapComponents/MapObjectComponent.svelte';
	import MapObjectSelector from '$components/MapComponents/MapObjectSelector.svelte';
	import type { PageData } from '../[[mapId]]/$houdini';
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
	import { updateMap } from '$lib/mutations/map';
	import { deleteRooms, updateRoomsOnMap } from '$lib/mutations/room';
	import { deleteWalls, updateWallsOnMap } from '$lib/mutations/wall';
	import { editedMapId, map } from '$lib/stores/mapCreationStore';
	import { allMapObjects, selectedMapObject } from '$lib/stores/mapObjectStore';
	import type { MapObject } from '$lib/types/mapObjectTypes';
	import {
		maxBottomTransform,
		maxLeftTransform,
		maxRightTransform,
		maxTopTransform,
		type TransformType
	} from '$lib/types/transformType';
	import {
		getModalStore,
		getToastStore,
		type ModalSettings,
		type ToastSettings
	} from '@skeletonlabs/skeleton';
	import panzoom, { type PanZoom } from 'panzoom';
	import { onDestroy, onMount } from 'svelte';

	let grid: HTMLElement;
	let main: HTMLElement;
	let container: HTMLElement;

	let canvas: HTMLCanvasElement;
	let panz: PanZoom;

	let mapObjects: { [key: string]: MapObjectComponent } = {};

	let saving: boolean = false;

	let showMapLoader = true;

	let finishedLoading = false;

	const modalStore = getModalStore();

	const toastStore = getToastStore();

	const modalEditDesk: ModalSettings = {
		type: 'component',
		component: 'modalEditDesk',
		response: (response: { userId: string } | null) => {
			if (!response?.userId || !$selectedMapObject) return;

			$selectedMapObject!.userId = response.userId;
			mapObjects[$selectedMapObject!.id].rerenderMapObject();
			saveMapObject($selectedMapObject!);
		}
	};

	const toastOffline: ToastSettings = {
		message: 'You are offline, changes may not be saved',
		hideDismiss: true,
		background: 'variant-filled-error'
	};

	const toastOnline: ToastSettings = {
		message: 'You are online, changes are beeing saved',
		hideDismiss: true,
		background: 'variant-filled-success'
	};

	const toastPublishFailed: ToastSettings = {
		message: 'Map could not be published',
		hideDismiss: true,
		background: 'variant-filled-error'
	};

	const toastPublishSuccess: ToastSettings = {
		message: 'Map successfully published',
		hideDismiss: true,
		background: 'variant-filled-success'
	};

	const publishMap = graphql(`
		mutation publishMap($mapId: ID!, $force: Boolean!) {
			publishMap(mapId: $mapId, force: $force)
		}
	`);

	export let data: PageData;

	$: ({ getMapSnapshotById } = data);

	$: mapData = $getMapSnapshotById.data?.getMapSnapshotById;

	$: () => {
		if (mapData) $map.height = mapData?.height;
	};

	$: () => {
		if (mapData) $map.width = mapData?.width;
	};

	$: {
		$editedMapId = mapData?.pk_mapId ?? '';
	}

	$: currentFloor = mapData?.floor;

	onMount(() => {
		panz = panzoom(grid, {
			...panzoomProps
		});
		panz.on('zoom', (e: PanZoom) => {
			$map.scale = e.getTransform().scale;
		});

		recenterMap();
		drawMapFromLocalDbData();

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('mousedown', handleMouseDown);

		window.addEventListener('online', handleOnline);
		window.addEventListener('offline', handleOffline);

		finishedLoading = true;
	});

	onDestroy(() => {
		if (!panz || !window) return;

		panz.dispose();
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('mousedown', handleMouseDown);

		window.removeEventListener('online', handleOnline);
		window.removeEventListener('offline', handleOffline);
	});

	const getMapById = async (mapId: string) => {
		return await getMapSnapshotById.fetch({
			variables: { mapId: mapId },
			policy: CachePolicy.NetworkOnly
		});
	};

	const publishCurrentMap = async () => {
		if (!mapData) return;
		const response = await publishMap.mutate({ mapId: mapData?.pk_mapId, force: false });

		if (response.errors) {
			console.error(response.errors);
			toastStore.trigger(toastPublishFailed);
			return;
		}

		if (response.data?.publishMap) {
			toastStore.trigger(toastPublishSuccess);
		} else {
			toastStore.trigger(toastPublishFailed);
		}
	};

	//#region handles
	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Delete') {
			delSelectedMapObject();
		}
	};

	const handleMouseDown = (event: MouseEvent) => {
		if (!$selectedMapObject) return;

		if (event.target !== container && event.target !== canvas) return;

		resetSelectedMapObjectStyle();
		$selectedMapObject = null;
	};

	const handleOffline = () => {
		toastStore.clear();
		toastStore.trigger(toastOffline);
	};

	const handleOnline = () => {
		saveMap();
		toastStore.clear();
		toastStore.trigger(toastOnline);
	};
	//#endregion

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

	const discardUnsavedChanges = () => alert('THIS IS DEPRICATED');

	const createMapObject = (
		event: MouseEvent,
		type: string,
		initialTransform: TransformType | null,
		id: string = '',
		dbID: string | null = null,
		text: string = '',
		userId: string | null = null
	) => {
		resetSelectedMapObjectStyle();
		let mapObject: MapObject = {
			dbID: dbID,
			id: id === '' ? genRandomId(type) : id,
			type: type,
			transform: { ...(initialTransform == null ? getTransformFromType(type) : initialTransform) },
			text: text,
			userId: userId
		};

		if (initialTransform == null) {
			mapObject.transform.x = event.clientX - main.getBoundingClientRect().left;
			mapObject.transform.y = event.clientY - main.getBoundingClientRect().top;
		}

		const element = new MapObjectComponent({
			target: initialTransform == null ? main : grid,
			props: {
				mapObject: mapObject,
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
		element.$on(
			'release',
			(event: CustomEvent<{ obj: MapObject; start: TransformType; destroyed: boolean }>) => {
				panz.resume();

				if (event.detail.destroyed) return;

				//check if the object was actually altered
				if (compareObjectsByValues(event.detail.obj.transform, event.detail.start)) return;

				resizeGrid(event.detail.obj.transform);
				normalizeGridSize();
				rerenderObjects();
				saveMapObject(event.detail.obj);
			}
		);

		element.$on('dblcDesk', (event: CustomEvent<MapObject>) => {
			selectMapObject(event.detail);
			modalStore.trigger(modalEditDesk);
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

	//#region humongous
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
		if (!$selectedMapObject) return;
		delMapObject($selectedMapObject);
	};

	const delMapObject = async (obj: MapObject) => {
		if ($getMapSnapshotById.fetching || saving) {
			return;
		}

		let deletePromis;
		if (obj.dbID) {
			showMapLoader = false;

			switch (obj.type) {
				case mapObjectType.Desk:
					deletePromis = deleteDesks.mutate({ deskIds: [obj.dbID] });
					break;
				case mapObjectType.Room:
					deletePromis = deleteRooms.mutate({ roomIds: [obj.dbID] });
					break;
				case mapObjectType.Wall:
					deletePromis = deleteWalls.mutate({ wallIds: [obj.dbID] });
					break;
				case mapObjectType.Door:
					deletePromis = deleteDoors.mutate({ doorIds: [obj.dbID] });
					break;
				case mapObjectType.Label:
					deletePromis = deleteLabels.mutate({ labelIds: [obj.dbID] });
					break;
			}
		}

		$allMapObjects = $allMapObjects.filter((mapObject) => mapObject.id !== obj.id);
		mapObjects[obj.id].$destroy();
		delete mapObjects[obj.id];
		normalizeGridSize();
		rerenderObjects();
		if (obj === $selectedMapObject) $selectedMapObject = null;

		if (obj.dbID) {
			await deletePromis;

			if ($map.height !== mapData?.height || $map.width !== mapData?.width) {
				await updateMap.mutate({
					mapId: mapData?.pk_mapId!,
					mapInput: {
						height: $map.height,
						width: $map.width,
						name: mapData?.name!
					}
				});
			}

			await getMapById(mapData?.pk_mapId!);
			showMapLoader = true;
		}
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

	const drawMapFromLocalDbData = (recenter: boolean = true) => {
		emptyMap();
		if (!mapData) {
			// DEBUG
			console.warn('no local map data to draw!');
			return;
		}

		$map.height = mapData.height;
		$map.width = mapData.width;

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
				desk.pk_deskid,
				'',
				desk.user?.pk_userid
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
		if (recenter) {
			panz.zoomAbs(0, 0, 1);
			recenterMap();
		}
		$allMapObjects = $allMapObjects;
		mapObjects = mapObjects;
	};

	const saveMapObject = async (mapObj: MapObject) => {
		if (mapData == null) return;
		saving = true;
		showMapLoader = false;

		await saveMap();
		// switch (mapObj.type) {
		// 	case mapObjectType.Desk:
		// 		const desk = await updateDesksOnMap.mutate({
		// 			mapId: mapData?.pk_mapId,
		// 			deskInputs: [getInputTypeFromMapObject(mapObj) as UpdateDeskInput]
		// 		});
		// 		if (desk.errors) return console.error(desk.errors);

		// 		const dObj = $allMapObjects.find((obj) => obj.id === mapObj.id);
		// 		dObj!.dbID = desk.data?.updateDesksOnMap![0].pk_deskid! ?? dObj?.dbID;
		// 		break;
		// 	case mapObjectType.Room:
		// 		const room = await updateRoomsOnMap.mutate({
		// 			mapId: mapData?.pk_mapId,
		// 			roomInputs: [getInputTypeFromMapObject(mapObj) as UpdateRoomInput]
		// 		});
		// 		if (room.errors) return console.error(room.errors);

		// 		const rObj = $allMapObjects.find((obj) => obj.id === mapObj.id);
		// 		rObj!.dbID = room.data?.updateRoomsOnMap![0].pk_roomId! ?? rObj?.dbID;
		// 		break;
		// 	case mapObjectType.Wall:
		// 		const wall = await updateWallsOnMap.mutate({
		// 			mapId: mapData?.pk_mapId,
		// 			wallInputs: [getInputTypeFromMapObject(mapObj) as UpdateWallInput]
		// 		});
		// 		if (wall.errors) return console.error(wall.errors);

		// 		const wObj = $allMapObjects.find((obj) => obj.id === mapObj.id);
		// 		wObj!.dbID = wall.data?.updateWallsOnMap![0].pk_wallId! ?? wObj?.dbID;
		// 		break;
		// 	case mapObjectType.Door:
		// 		const door = await updateDoorsOnMap.mutate({
		// 			mapId: mapData?.pk_mapId,
		// 			doorInputs: [getInputTypeFromMapObject(mapObj) as UpdateDoorInput]
		// 		});
		// 		if (door.errors) return console.error(door.errors);

		// 		const doObj = $allMapObjects.find((obj) => obj.id === mapObj.id);
		// 		doObj!.dbID = door.data?.updateDoorsOnMap![0].pk_doorId! ?? doObj?.dbID;
		// 		break;
		// 	case mapObjectType.Label:
		// 		const label = await updateLabelsOnMap.mutate({
		// 			mapId: mapData?.pk_mapId,
		// 			labelInputs: [getInputTypeFromMapObject(mapObj) as UpdateLabelInput]
		// 		});
		// 		if (label.errors) return console.error(label.errors);

		// 		const lObj = $allMapObjects.find((obj) => obj.id === mapObj.id);
		// 		lObj!.dbID = label.data?.updateLabelsOnMap![0].pk_labelId! ?? lObj?.dbID;
		// 		break;
		// }

		// if ($map.height !== mapData.height || $map.width !== mapData.width) {
		// 	await updateMap.mutate({
		// 		mapId: mapData.pk_mapId,
		// 		mapInput: {
		// 			height: $map.height,
		// 			width: $map.width,
		// 			name: mapData.name
		// 		}
		// 	});
		// }

		// await getMapById(mapData?.pk_mapId!);

		showMapLoader = true;
		saving = false;
	};

	const saveMap = async () => {
		if (mapData == null) return;

		saving = true;
		resetSelectedMapObjectStyle();
		$selectedMapObject = null;
		showMapLoader = false;

		const desks: UpdateDeskInput[] = $allMapObjects
			.filter((obj) => obj.type === mapObjectType.Desk)
			.map((obj) => {
				const desk = mapData!.desks?.find((d) => d.pk_deskid === obj.dbID);
				if (
					compareObjectsByValues(
						{
							dbID: obj.dbID,
							id: obj.id,
							x: obj.transform.x,
							y: obj.transform.y,
							userId: obj.userId
						},
						{
							dbID: desk?.pk_deskid,
							id: desk?.desknum,
							x: desk?.x,
							y: desk?.y,
							userId: desk?.user?.pk_userid ?? null
						}
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
				width: $map.width,
				name: mapData.name
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

		await getMapById(mapData?.pk_mapId!);

		$allMapObjects = $allMapObjects.map((obj) => {
			obj.dbID = mapData?.desks?.find((d) => d.desknum === obj.id)?.pk_deskid ?? obj.dbID;
			return obj;
		});
		showMapLoader = true;
		saving = false;
	};
	//#endregion
</script>

<main bind:this={main} class="overflow-hidden h-full">
	<div class="absolute p-2 flex gap-1 w-full bg-red-500">
		<!--temporary-->
		<a href="/" class="btn variant-filled-primary z-[100]">Home</a>
		<!---->
		<!-- <button
			on:click={saveMap}
			class="absolute left-1/2 -translate-x-1/2 bottom-24 btn variant-filled-primary rounded-full w-24 z-[100]"
			>{$getMapSnapshotById.fetching ? 'loading' : 'SAVE'}</button
		> -->
		<button class="btn variant-filled-primary z-[100]" on:click={discardUnsavedChanges}>
			Discrad
		</button>
		<button class="btn variant-filled-primary z-[100]" on:click={handleOffline}> Offline </button>
		<button class="btn variant-filled-primary z-[100]" on:click={handleOnline}> Online </button>
		<button
			class="btn variant-filled-primary z-[100]"
			on:click={() => {
				goto(`/admin`);
			}}
		>
			Change Snapshot
		</button>
	</div>

	<button
		class="absolute -translate-x-1/2 left-1/2 bottom-10 btn variant-filled-primary z-[100]"
		on:click={publishCurrentMap}
	>
		Publish
	</button>

	<MapObjectSelector
		on:create={(event) => {
			if ($getMapSnapshotById.fetching || !mapData) {
				return;
			}

			createMapObject(event.detail.e, event.detail.type, null);
		}}
	/>

	<AdminSerachbar
		values={mapData?.desks
			?.map((desk) => ({
				label: desk.desknum,
				value: desk.desknum
			}))
			.concat(
				mapData?.desks
					?.filter((d) => d.user !== null)
					.map((des) => ({ label: des.user?.username ?? des.desknum, value: des.desknum })) // des.user CAN NOT BE NULL!!!!!!!!
			)
			?.sort(
				(a, b) =>
					parseFloat(a.label.substring(2, a.label.length)) -
					parseFloat(b.label.substring(2, b.label.length))
			) ?? []}
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
			<canvas
				bind:this={canvas}
				width={$map.width}
				height={$map.height}
				draggable="false"
				class="canvasStyle"
			/>
		</div>
	</div>
</main>

<style>
	@import 'tailwindcss/base';
	@import 'tailwindcss/components';
	@import 'tailwindcss/utilities';
</style>
