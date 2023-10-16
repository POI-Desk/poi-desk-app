<!-- TODO: MAKE ALL COMPONENTS IN THE MAP UNIFIED IN ONE LIST + POSSIBLY SEPERATE LISTS FOR API -->
<!-- TODO: HARDCORE BUGS, FIX THEM USE MAPOBJECT, LOOK INTO REFFERENCING TRANSFORM TO THE COMPOENNETS -->

<script lang="ts">
	import SaveMapModal from '$components/MapComponents/SaveMapModal.svelte';
	import MapObjectComponent from '$components/MapComponents/MapObjectComponent.svelte';
	import { addDesksToFloor as addDesksToFloor } from '$lib/mutations/desks';
	import { onDestroy, onMount } from 'svelte';
	import panzoom, { type PanZoom } from 'panzoom';
	import {
		defaultMapProps,
		deskProps,
		getTransformFromType,
		mapObjectType,
		panzoomProps
	} from '$lib/map/props';
	import { selectedMapObject, allMapObjects } from '$lib/stores/mapObjectStore';
	import type { TransformType } from '$lib/types/transformType';
	import { map } from '$lib/stores/mapCreationStore';
	import type { MapObject } from '$lib/types/mapObjectTypes';

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
				initMouseY: event.clientY,
				mapObjectNum: defaultObjNum
			}
		});

		element.$on('selectDesk', (event: CustomEvent<{ transform: TransformType }>) => {
			panz.pause();
			resetSelectedMapObjectStyle();
			$selectedMapObject = $allMapObjects.find(
				(mapObject) => mapObject.transform === event.detail.transform
			)!;
		});

		element.$on(
			'releaseDesk',
			(event: CustomEvent<{ left: number; top: number; enabled: boolean }>) => {
				panz.resume();
				if (!event.detail.enabled) {
					delSelectedMapObject();
					return;
				}
				let left: number = event.detail.left;
				let top: number = event.detail.top;
				resizeGrid(left, top);
				normalizeGridSize();
				rerenderObjectPositions();
			}
		);
		panz.pause();
		$selectedMapObject = mapObject;
		$allMapObjects.push(mapObject);
		mapObjects[defaultObjNum] = element;
		defaultObjNum += '1';
	};

	//x and y are in local space of the parent element
	const resizeGrid = (x: number, y: number) => {
		let panzOffsetX: number = 0;
		let panzOffsetY: number = 0;

		const objW = deskProps.width * 0.5;
		const objH = deskProps.height * 0.5;

		if (x < 0 + defaultMapProps.border + objW) {
			$map.width += (x > 0 ? objW - x : Math.abs(x) + objW) + defaultMapProps.border;
			panzOffsetX = x - (objW + defaultMapProps.border);
		} else if (x > $map.width - (defaultMapProps.border + objW)) {
			$map.width += x - $map.width + objW + defaultMapProps.border;
		}
		if (y < 0 + defaultMapProps.border + objH) {
			$map.height += (y > 0 ? objH - y : Math.abs(y) + objH) + defaultMapProps.border;
			panzOffsetY = y - (objH + defaultMapProps.border);
		} else if (y > $map.height - (defaultMapProps.border + objH)) {
			$map.height += y - $map.height + objH + defaultMapProps.border;
		}

		if (panzOffsetX !== 0 || panzOffsetY !== 0) {
			//TODO: this does not rerender
			$allMapObjects.forEach((mapObject) => {
				mapObject.transform.x -= panzOffsetX;
				mapObject.transform.y -= panzOffsetY;
			});
			// console.log(deskProps);
			// $allMapObjects.forEach((mapObject) => {
			// 	console.log(mapObject.id, mapObject.transform);
			// });
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

		let left: number = Number.MAX_SAFE_INTEGER;
		let right: number = Number.MIN_SAFE_INTEGER;
		let top: number = Number.MAX_SAFE_INTEGER;
		let bottom: number = Number.MIN_SAFE_INTEGER;
		$allMapObjects.forEach((mapObject) => {
			if (mapObject.transform.x! < left) left = mapObject.transform.x!;
			if (mapObject.transform.y! < top) top = mapObject.transform.y!;
		});

		let horizontalOffset: number = 0;
		let verticalOffset: number = 0;

		let mapWidth: number = defaultMapProps.width;
		let mapHeight: number = defaultMapProps.height;

		if (
			left > defaultMapProps.maxHorizontalDist ||
			(left > defaultMapProps.border + deskProps.width * 0.5 &&
				left < defaultMapProps.border + deskProps.width + ($map.width - defaultMapProps.width))
		) {
			horizontalOffset = -left + deskProps.width * 0.5 + defaultMapProps.border;
		}
		if (
			top > defaultMapProps.maxVerticalDist ||
			(left > defaultMapProps.border + deskProps.height * 0.5 &&
				left < defaultMapProps.border + deskProps.height + ($map.height - defaultMapProps.width))
		) {
			verticalOffset = -top + deskProps.height * 0.5 + defaultMapProps.border;
		}

		$allMapObjects.forEach((mapObject) => {
			mapObject.transform.x += horizontalOffset;
			mapObject.transform.y += verticalOffset;
			if (mapObject.transform.y! > bottom) bottom = mapObject.transform.y!;
			if (mapObject.transform.x! > right) right = mapObject.transform.x!;
		});

		if (right > defaultMapProps.width - (defaultMapProps.border + deskProps.width * 0.5)) {
			mapWidth = right + deskProps.width * 0.5 + defaultMapProps.border;
		}
		if (bottom > defaultMapProps.height - (defaultMapProps.border + deskProps.height * 0.5)) {
			mapHeight = bottom + deskProps.height * 0.5 + defaultMapProps.border;
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
	};

	const resetSelectedMapObjectStyle = () => {
		if (!$selectedMapObject) return;
		//$selectedMapObject.element.style.removeProperty('border');
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

<main bind:this={main} class="overflow-hidden flex flex-row h-screen">
	<SaveMapModal {openModal} on:closeModal={toggleModal} />
	<div class="w-2/12 h-screen bg-gray-600 shadow-xl shadow-black z-10">
		<button
			on:mousedown={(e) => createMapObject(e, mapObjectType.Desk)}
			class="btn variant-filled-primary">Desk</button
		>
		<button
			on:mousedown={(e) => createMapObject(e, mapObjectType.Room)}
			class="btn variant-filled-primary">Room</button
		>
	</div>
	<div bind:this={container} class="overflow-auto w-screen">
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
				class="bg-slate-500"
			/>
		</div>
	</div>
</main>

<style>
	@import 'tailwindcss/base';
	@import 'tailwindcss/components';
	@import 'tailwindcss/utilities';
</style>
