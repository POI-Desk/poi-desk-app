<!-- TODO: MAKE ALL COMPONENTS IN THE MAP UNIFIED IN ONE LIST + POSSIBLY SEPERATE LISTS FOR API -->
<!-- TODO: HARDCORE BUGS, FIX THEM USE MAPOBJECT, LOOK INTO REFFERENCING TRANSFORM TO THE COMPOENNETS -->

<script lang="ts">
	import SaveMapModal from '$components/MapComponents/SaveMapModal.svelte';
	import MapObjectComponent from '$components/MapComponents/MapObjectComponent.svelte';
	import { addDesksToFloor as addDesksToFloor } from '$lib/mutations/desks';
	import { onDestroy, onMount } from 'svelte';
	import panzoom, { type PanZoom } from 'panzoom';
	import { defaultMapScale, deskProps, mapObjectType, panzoomProps } from '$lib/map/props';
	import { selectedMapObject, allMapObjects } from '$lib/stores/mapObjectStore';
	import type { TransformType } from '$lib/types/transformType';

	let grid: HTMLElement;
	let main: HTMLElement;
	let container: HTMLElement;

	let canvas: HTMLCanvasElement;
	let panz: PanZoom;
	let scale: number = 1;

	let openModal: boolean = false;

	let defaultObjNum: string = '1';

	let mapObjects: { [key: string]: MapObjectComponent } = {};

	onMount(() => {
		panz = panzoom(grid, panzoomProps);

		panz.on('zoom', (e: PanZoom) => {
			scale = e.getTransform().scale;
			Object.keys(mapObjects).forEach((key) => {
				let mapObject = mapObjects[key];
				mapObject.$set({
					scale: scale
				});
			});
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
		if (event.target === canvas && $selectedMapObject.element) {
			resetSelectedMapObjectStyle();
			$selectedMapObject = {
				element: null,
				mapObject: null
			};
		}
	};

	const removeMapObject = () => {
		if (!$selectedMapObject.element || !$selectedMapObject.mapObject) {
			return;
		}
		delSelectedMapObject();
	};

	const createMapObject = (event: MouseEvent, type: string) => {
		scale = panz.getTransform().scale;
		resetSelectedMapObjectStyle();
		const element = new MapObjectComponent({
			target: main,
			props: {
        type: mapObjectType.Desk,
				enabled: false,
				target: grid,
				main: main,
				drawer: container,
				initX: event.clientX - main.getBoundingClientRect().left,
				initY: event.clientY - main.getBoundingClientRect().top,
				scale: scale,
				initMouseX: event.clientX,
				initMouseY: event.clientY,
				initDrag: true,
				MapObjectNum: defaultObjNum
			}
		});

		element.$on('selectDesk', (event: CustomEvent<{ transform: TransformType }>) => {
			panz.pause();
			resetSelectedMapObjectStyle();
			$selectedMapObject = $allMapObjects.find((mapObject) => mapObject.transform === event.detail.transform)!
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
			}
		);
		panz.pause();
		$allMapObjects.push($selectedMapObject!);
		mapObjects[defaultObjNum] = element;
		defaultObjNum += '1';
	};

	//x and y are in local space of the parent element
	const resizeGrid = (x: number, y: number) => {
		const grid_width: number = +grid.style.width.slice(0, -2);
		const grid_height: number = +grid.style.height.slice(0, -2);

		let panzOffsetX: number = 0;
		let panzOffsetY: number = 0;

		const objW = deskProps.width * 0.5;
		const objH = deskProps.height * 0.5;

		if (x < 0 + defaultMapScale.border + objW) {
			grid.style.width =
				grid_width + (x > 0 ? objW - x : Math.abs(x) + objW) + defaultMapScale.border + 'px';
			panzOffsetX = x - (objW + defaultMapScale.border);
		} else if (x > grid_width - (defaultMapScale.border + objW)) {
			grid.style.width = grid_width + (x - grid_width) + objW + defaultMapScale.border + 'px';
		}
		if (y < 0 + defaultMapScale.border + objH) {
			grid.style.height =
				grid_height + (y > 0 ? objH - y : Math.abs(y) + objH) + defaultMapScale.border + 'px';
			panzOffsetY = y - (objH + defaultMapScale.border);
		} else if (y > grid_height - (defaultMapScale.border + objH)) {
			grid.style.height = grid_height + (y - grid_height) + objH + defaultMapScale.border + 'px';
		}

		if (panzOffsetX !== 0 || panzOffsetY !== 0) {
			$allMapObjects.forEach((mapObject) => {
				const style: CSSStyleDeclaration = mapObject.element?.style!;
				let l: number = +style.left.slice(0, -2) - panzOffsetX;
				let t: number = +style.top.slice(0, -2) - panzOffsetY;

				style.left = l + 'px';
				style.top = t + 'px';
				if (mapObject.mapObject?.objNum! === $selectedMapObject.mapObject?.objNum!) {
					$selectedMapObject.mapObject!.x = l;
					$selectedMapObject.mapObject!.y = t;
				}
				mapObjects[mapObject.mapObject?.objNum!].setCoords(+style.left.slice(0, -2), +style.top.slice(0, -2));
			});
		}

		canvas.width = +grid.style.width.slice(0, -2);
		canvas.height = +grid.style.height.slice(0, -2);
		panz.moveTo(
			panz.getTransform().x + panzOffsetX * scale,
			panz.getTransform().y + panzOffsetY * scale
		);
	};

	const normalizeGridSize = () => {
		if ($allMapObjects.length === 0) {
			grid.style.width = defaultMapScale.width + 'px';
			grid.style.height = defaultMapScale.height + 'px';
			canvas.width = defaultMapScale.width;
			canvas.height = defaultMapScale.height;
			return;
		}
		const grid_width: number = +grid.style.width.slice(0, -2);
		const grid_height: number = +grid.style.height.slice(0, -2);

		let left: number = Number.MAX_SAFE_INTEGER;
		let right: number = Number.MIN_SAFE_INTEGER;
		let top: number = Number.MAX_SAFE_INTEGER;
		let bottom: number = Number.MIN_SAFE_INTEGER;
		$allMapObjects.forEach((mapObject) => {
			if (mapObject.x! < left) left = mapObject.x!;
			if (mapObject.y! < top) top = mapObject.y!;
		});

		let horizontalOffset: number = 0;
		let verticalOffset: number = 0;

		let mapWidth: number = defaultMapScale.width;
		let mapHeight: number = defaultMapScale.height;

		if (
			left > defaultMapScale.maxHorizontalDist ||
			(left > defaultMapScale.border + deskProps.width * 0.5 &&
				left < defaultMapScale.border + deskProps.width + (grid_width - defaultMapScale.width))
		) {
			horizontalOffset = -left + deskProps.width * 0.5 + defaultMapScale.border;
		}
		if (
			top > defaultMapScale.maxVerticalDist ||
			(left > defaultMapScale.border + deskProps.height * 0.5 &&
				left < defaultMapScale.border + deskProps.height + (grid_height - defaultMapScale.width))
		) {
			verticalOffset = -top + deskProps.height * 0.5 + defaultMapScale.border;
		}

		$allMapObjects.forEach((mapObject) => {
			mapObject.x += horizontalOffset;
			mapObject.y += verticalOffset;
			if (mapObject.y! > bottom) bottom = mapObject.y!;
			if (mapObject.x! > right) right = mapObject.x!;
		});

		if (right > defaultMapScale.width - (defaultMapScale.border + deskProps.width * 0.5)) {
			mapWidth = right + deskProps.width * 0.5 + defaultMapScale.border;
		}
		if (bottom > defaultMapScale.height - (defaultMapScale.border + deskProps.height * 0.5)) {
			mapHeight = bottom + deskProps.height * 0.5 + defaultMapScale.border;
		}

		panz.moveTo(
			panz.getTransform().x - horizontalOffset * scale,
			panz.getTransform().y - verticalOffset * scale
		);

		grid.style.width = mapWidth + 'px';
		grid.style.height = mapHeight + 'px';
		canvas.width = mapWidth;
		canvas.height = mapHeight;
	};

	const delSelectedMapObject = () => {
		$allMapObjects = $allMapObjects.filter((mapObject) => mapObject.mapObject!.objNum !== $selectedMapObject.mapObject?.objNum);
		mapObjects[$selectedMapObject.mapObject!.objNum].$destroy();
		delete mapObjects[$selectedMapObject.mapObject!.objNum];
		$selectedMapObject = {
			element: null,
			mapObject: null
		};
		normalizeGridSize();
	};

	const resetSelectedMapObjectStyle = () => {
		if (!$selectedMapObject.element) return;
		$selectedMapObject.element.style.removeProperty('border');
	};

	const toggleModal = () => {
		openModal = !openModal;
	};

	const saveMap = () => {
		addDesksToFloor.mutate({
			floorid: '3af4f424-a92b- -bfdb-55bd768218be',
			desks: $allMapObjects.map((s) => s.mapObject!)
		});
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
		<button on:mousedown={(e) => createMapObject(e, mapObjectType.Desk)} class="btn variant-filled-primary">Desk</button>
		<button on:mousedown={(e) => createMapObject(e, mapObjectType.Room)} class="btn variant-filled-primary">Room</button>
	</div>
	<div bind:this={container} class="overflow-auto w-screen">
		<div
			bind:this={grid}
			on:mouseenter={enterGrid}
			on:mouseleave={leaveGrid}
			role="grid"
			tabindex="0"
			style="width: {defaultMapScale.width}px; height: {defaultMapScale.height}px;"
			class="z-0"
		>
			<canvas
				bind:this={canvas}
				width={defaultMapScale.width}
				height={defaultMapScale.height}
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
