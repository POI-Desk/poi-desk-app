<!-- TODO: MAKE ALL COMPONENTS IN THE MAP UNIFIED IN ONE LIST + POSSIBLY SEPERATE LISTS FOR API -->

<script lang="ts">
	import FloorSelection from '$components/FloorSelection.svelte';
	// import { getBuildings } from '$lib/queries/buildingQueries';
	import AdminBuildingSelector from '$components/MapComponents/AdminBuildingSelector.svelte';
	import AdminFloorSelector from '$components/MapComponents/AdminFloorSelector.svelte';
	import AdminSerachbar from '$components/MapComponents/AdminSerachbar.svelte';
	import MapObjectComponent from '$components/MapComponents/MapObjectComponent.svelte';
	import MapObjectSelector from '$components/MapComponents/MapObjectSelector.svelte';
	import { graphql } from '$houdini';

	import {
		defaultMapProps,
		deskProps,
		doorProps,
		getTransformFromType,
		mapObjectType,
		panzoomProps,
		roomProps,
		wallProps
	} from '$lib/map/props';
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
	import { ProgressBar, ProgressRadial } from '@skeletonlabs/skeleton';
	import panzoom, { type PanZoom } from 'panzoom';
	import { onDestroy, onMount } from 'svelte';

	let grid: HTMLElement;
	let main: HTMLElement;
	let container: HTMLElement;

	let canvas: HTMLCanvasElement;
	let panz: PanZoom;

	let openModal: boolean = false;

	let mapObjects: { [key: string]: MapObjectComponent } = {};

	let currentBuildingID: string = '';
	let currentFloorID: string = '';
	let loadingMap: boolean = false;

	const getBuildings = graphql(`
		query getBuildings($floorId: ID!) {
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

	const getMapByFloor = graphql(`
		query getMapByFloor($floorID: ID!) {
			getMapByFloor(floorId: $floorID) {
				pk_mapId
				height
				width
				desks {
					desknum
					x
					y
					rotation
				}
				rooms {
					pk_roomId
					x
					y
					width
					height
				}
				walls {
					pk_wallId
					x
					y
					rotation
					width
				}
				doors {
					pk_doorId
					x
					y
					rotation
					width
				}
			}
		}
	`);

	const locationIdVienna: string = '241ef7e9-0cb8-46fb-a378-2c9614b8f9e4'; //TODO: get from admin user
	const locationIdHagenberg: string = '9a9dd736-dfd8-4bcb-b51b-dc73ba315a76'; //TODO: get from admin user
	let buildings: any;
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
		await changeBuilding(buildings[1].pk_buildingid, buildings[1].floors[1].pk_floorid);
	};

	const recenterMap = (smooth: boolean = false, offsetX: number = 0, offsetY: number = 0) => {
		if (!smooth)
			panz.moveTo(
				window.innerWidth / 2 - ($map.width / 2 + offsetX) * $map.scale,
				window.innerHeight / 2 - ($map.height / 2 + offsetY) * $map.scale
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
		id: string = ''
	) => {
		resetSelectedMapObjectStyle();
		let mapObject: MapObject = {
			id: id === '' ? genRandomId(5) : id,
			type: type,
			transform: { ...(initialTransform == null ? getTransformFromType(type) : initialTransform) }
		};

		if (initialTransform == null) {
			mapObject.transform.x = event.clientX - main.getBoundingClientRect().left;
			mapObject.transform.y = event.clientY - main.getBoundingClientRect().top;
		}

		const element = new MapObjectComponent({
			target: initialTransform == null ? main : grid,
			props: {
				mapObject: mapObject,
				enabled: initialTransform != null,
				target: grid,
				main: main,
				drawer: container,
				initMouseX: event.clientX,
				initMouseY: event.clientY,
				initialDrag: initialTransform == null
			}
		});

		element.$on('select', (event: CustomEvent<TransformType>) => {
			panz.pause();
			resetSelectedMapObjectStyle();
			selectMapObject($allMapObjects.find((mapObject) => mapObject.transform === event.detail)!);
		});

		element.$on('release', (event: CustomEvent<{ transform: TransformType; enabled: boolean }>) => {
			panz.resume();
			if (!event.detail.enabled) {
				delSelectedMapObject();
				return;
			}
			resizeGrid(event.detail.transform);
			normalizeGridSize();
			rerenderObjectPositions();
		});
		panz.pause();
		$selectedMapObject = initialTransform == null ? mapObject : null;
		$allMapObjects.push(mapObject);
		mapObjects[mapObject.id] = element;

		$allMapObjects = $allMapObjects;
		mapObjects = mapObjects;
	};

	const genRandomId = (length: number) => {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		const charactersLength = characters.length;
		let result;
		do {
			result = '';
			for (let i = 0; i < length; i++) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
		} while (mapObjects[result] != null);
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
			$allMapObjects.forEach((mapObject) => {
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
		$allMapObjects.forEach((mapObject) => {
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

		$allMapObjects.forEach((mapObject) => {
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

	const rerenderObjectPositions = () => {
		for (const [key, value] of Object.entries(mapObjects)) {
			value.rerenderPosition();
		}
	};

	const delSelectedMapObject = () => {
		$allMapObjects = $allMapObjects.filter((mapObject) => mapObject.id !== $selectedMapObject!.id);
		mapObjects[$selectedMapObject!.id].$destroy();
		delete mapObjects[$selectedMapObject!.id];
		$selectedMapObject = null;
		normalizeGridSize();
		rerenderObjectPositions();
	};

	const resetSelectedMapObjectStyle = () => {
		if (!$selectedMapObject) return;
		mapObjects[$selectedMapObject.id].removeSelectedStyle();
	};

	const toggleModal = () => {
		openModal = !openModal;
	};

	const enterGrid = (event: MouseEvent) => {
		panz.resume();
	};

	const leaveGrid = (event: MouseEvent) => {
		panz.pause();
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
		//TODO: look into the 'any' type problem
		let floorID: string =
			customFloorID ??
			buildings.filter((b) => b.pk_buildingid === buildingID)[0]?.floors[0].pk_floorid;
		await changeFloor(floorID);
		buildings = buildings;
	};

	const changeFloor = async (floorID: string) => {
		if (floorID === currentFloorID) return;
		for (const [key, value] of Object.entries(mapObjects)) {
			value.$destroy();
		}
		mapObjects = {};
		loadingMap = true;
		await getMapByFloor.fetch({ variables: { floorID: floorID } });
		loadingMap = false;
		drawMap();
		currentFloorID = floorID;
	};

	const drawMap = () => {
		if (!$getMapByFloor.data?.getMapByFloor) return;
		$allMapObjects = [];
		$selectedMapObject = null;

		$map.height = $getMapByFloor.data.getMapByFloor.height;
		$map.width = $getMapByFloor.data.getMapByFloor.width;
		$map.scale = 1;
		$getMapByFloor.data?.getMapByFloor.desks!.map((desk) => {
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
				desk.desknum
			);
		});
		$getMapByFloor.data?.getMapByFloor.doors!.map((door) => {
			createMapObject({ clientX: door.x, clientY: door.y } as MouseEvent, mapObjectType.Door, {
				x: door.x,
				y: door.y,
				width: door.width,
				height: doorProps.height,
				rotation: door.rotation
			} as TransformType);
		});
		$getMapByFloor.data?.getMapByFloor.rooms!.map((room) => {
			createMapObject({ clientX: room.x, clientY: room.y } as MouseEvent, mapObjectType.Room, {
				x: room.x,
				y: room.y,
				width: room.width,
				height: room.height,
				rotation: roomProps.rotation
			} as TransformType);
		});
		$getMapByFloor.data?.getMapByFloor.walls!.map((wall) => {
			createMapObject({ clientX: wall.x, clientY: wall.y } as MouseEvent, mapObjectType.Wall, {
				x: wall.x,
				y: wall.y,
				width: wall.width,
				height: wallProps.height,
				rotation: wall.rotation
			} as TransformType);
		});
		recenterMap();
	};
</script>

<main bind:this={main} class="overflow-hidden h-full">
	<MapObjectSelector
		on:create={(event) => createMapObject(event.detail.e, event.detail.type, null)}
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
		names={$allMapObjects.map((o) => o.id)}
		on:selected={(event) => zoomToObjectId(event.detail)}
	/>
	<div bind:this={container} class="overflow-hidden h-full">
		<div
			bind:this={grid}
			on:mouseenter={enterGrid}
			on:mouseleave={leaveGrid}
			role="grid"
			tabindex="0"
			style="width: {$map.width}px; height: {$map.height}px;"
			class="z-0"
		>
			{#if loadingMap}
				<div class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-1/6">
					<ProgressBar value={undefined} />
				</div>
			{/if}
			<canvas
				bind:this={canvas}
				width={$map.width}
				height={$map.height}
				draggable="false"
				class="bg-[#D9D9D9]"
			/>
		</div>
	</div>
</main>

<style>
	@import 'tailwindcss/base';
	@import 'tailwindcss/components';
	@import 'tailwindcss/utilities';
</style>
