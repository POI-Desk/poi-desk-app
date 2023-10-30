<!-- TODO: MAKE ALL COMPONENTS IN THE MAP UNIFIED IN ONE LIST + POSSIBLY SEPERATE LISTS FOR API -->

<script lang="ts">
	import MapObjectComponent from '$components/MapComponents/MapObjectComponent.svelte';
	import MapObjectSelector from '$components/MapComponents/MapObjectSelector.svelte';
	import {
		defaultMapProps,
		getTransformFromType,
		mapObjectType,
		panzoomProps
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
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import panzoom, { type PanZoom } from 'panzoom';
	import { onDestroy, onMount } from 'svelte';

	let grid: HTMLElement;
	let main: HTMLElement;
	let container: HTMLElement;

	let canvas: HTMLCanvasElement;
	let panz: PanZoom;

	let openModal: boolean = false;

	let defaultObjNum: string = '1';

	let mapObjects: { [key: string]: MapObjectComponent } = {};

	onMount(() => {
		panz = panzoom(grid, panzoomProps);

		panz.on('zoom', (e: PanZoom) => {
			$map.scale = e.getTransform().scale;
		});
    panz.moveTo(window.innerWidth / 2 - $map.width / 2, window.innerHeight / 2 - $map.height / 2);

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

	const removeMapObject = () => {
		if (!$selectedMapObject) {
			return;
		}
		delSelectedMapObject();
	};

	const createMapObject = (event: MouseEvent, type: string) => {
		resetSelectedMapObjectStyle();
		let mapObject: MapObject = {
			id: defaultObjNum,
			type: type,
			transform: { ...getTransformFromType(type) }
		};
		mapObject.transform.x = event.clientX - main.getBoundingClientRect().left;
		mapObject.transform.y = event.clientY - main.getBoundingClientRect().top;

		const element = new MapObjectComponent({
			target: main,
			props: {
				mapObject: mapObject,
				enabled: false,
				target: grid,
				main: main,
				drawer: container,
				initMouseX: event.clientX,
				initMouseY: event.clientY
			}
		});

		element.$on('select', (event: CustomEvent<TransformType>) => {
			panz.pause();
			resetSelectedMapObjectStyle();
			$selectedMapObject = $allMapObjects.find(
				(mapObject) => mapObject.transform === event.detail
			)!;
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
		$selectedMapObject = mapObject;
		$allMapObjects.push(mapObject);
		mapObjects[defaultObjNum] = element;
		defaultObjNum += '1';
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
			if (mapObject.transform.y! + mapObject.transform.height > bottom.y + right.height) bottom = { ...mapObject.transform };
			if (mapObject.transform.x! + mapObject.transform.width > right.x + right.width) right = { ...mapObject.transform };
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
</script>

<main bind:this={main} class="overflow-hidden h-full">
  <MapObjectSelector on:create={(event) => createMapObject(event.detail.e, event.detail.type)} />

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