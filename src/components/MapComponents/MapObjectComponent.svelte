<!--TODO: make selected object on top of other object -->
<!-- TODO: look into the is in grid check -->
<!-- TODO: better border for rooms (svg maby (probably)) -->

<script lang="ts">
	import { closestNumber, inBoundingbox, transformPosition } from '$lib/map/helper';
	import { mapMagnetSteps, mapObjectType, wallProps, wallThickness } from '$lib/map/props';
	import { map } from '$lib/stores/mapCreationStore';
	import type { MapObject } from '$lib/types/mapObjectTypes';
	import type { TransformType } from '$lib/types/transformType';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	//Look into this so import is not needed
	import '../../styles/handles.css';
	import DeskSvg from './MapObjects/DeskSVG.svelte';
	import DoorSvg from './MapObjects/DoorSVG.svelte';
	import RoomSvg from './MapObjects/RoomSVG.svelte';
	import WallSvg from './MapObjects/WallSVG.svelte';

	export let mapObject: MapObject;
	export let target: HTMLElement;
	export let main: HTMLElement;
	export let drawer: HTMLElement;
	export let initMouseX: number = 0;
	export let initMouseY: number = 0;
	export let initialDrag: boolean;

	let drag: HTMLElement;
	let dragging: boolean = false;
	let resizing: boolean = false;
	let offsetX: number = 0;
	let offsetY: number = 0;

	let selected: boolean = false;
	let destroyed: boolean = false;

	let right: HTMLDivElement | null = null;
	let bottom: HTMLDivElement | null = null;
	let left: HTMLDivElement | null = null;
	let top: HTMLDivElement | null = null;
	let topLeft: HTMLDivElement | null = null;
	let topRight: HTMLDivElement | null = null;
	let bottomLeft: HTMLDivElement | null = null;
	let bottomRight: HTMLDivElement | null = null;
	let grabbers: HTMLDivElement[] = [];

	// export const setCoords = (x: number, y: number) => {
	// 	left = x;
	// 	top = y;
	// };

	let dispatch = createEventDispatcher();

	onMount(() => {
		if (!initialDrag) return;
		applySelectedStyle();
		enable();

		handleDragStart(new MouseEvent('mousedown', { clientX: initMouseX, clientY: initMouseY }));
		const offsetX = initMouseX / $map.scale - mapObject.transform.x;
		const offsetY = initMouseY / $map.scale - mapObject.transform.y;
		const x = initMouseX / $map.scale - offsetX;
		const y = initMouseY / $map.scale - offsetY;
		const wallOffset = mapObject.type == mapObjectType.Room ? wallProps.height / 2 : 0;
		// mapObject.transform.x = enabled ? closestNumber(x, mapMagnetSteps) - wallOffset : x;
		// mapObject.transform.y = enabled ? closestNumber(y, mapMagnetSteps) - wallOffset : y;
		mapObject.transform.x = closestNumber(x, mapMagnetSteps) - wallOffset;
		mapObject.transform.y = closestNumber(y, mapMagnetSteps) - wallOffset;
	});

	onDestroy(() => {
		destroyed = true;
	});

	const enable = () => {
		// enabled = true;
		// drag?.style.setProperty('opacity', '1');
		const transformedPos = transformPosition(
			drag!.getBoundingClientRect(),
			target.getBoundingClientRect(),
			main.getBoundingClientRect()
		);

		if (drag?.parentElement) drag?.parentElement.removeChild(drag!);
		target.appendChild(drag!);
		offsetX += target.getBoundingClientRect().left / $map.scale;
		offsetY += target.getBoundingClientRect().top / $map.scale;

		mapObject.transform.x = transformedPos.x / $map.scale - offsetX;
		mapObject.transform.y = transformedPos.y / $map.scale - offsetY;
	};

	/* Old for disabling objects out of the canvas
	const disable = () => {
		enabled = false;
		drag?.style.setProperty('opacity', '0.7');
		const transformedPos = transformPosition(
			drag!.getBoundingClientRect(),
			main.getBoundingClientRect(),
			target.getBoundingClientRect()
		);

		if (drag?.parentElement) drag?.parentElement.removeChild(drag!);
		main.appendChild(drag!);
		offsetX -= target.getBoundingClientRect().left / $map.scale;
		offsetY -= target.getBoundingClientRect().top / $map.scale;

		mapObject.transform.x = transformedPos.x / $map.scale - offsetX;
		mapObject.transform.y = transformedPos.y / $map.scale - offsetY;
	};
	*/
	const handleDragStart = (event: MouseEvent) => {
		if (event.button != 0) return;

		dragging = true;
		offsetX = event.clientX / $map.scale - mapObject.transform.x;
		offsetY = event.clientY / $map.scale - mapObject.transform.y;
		dispatch('select', mapObject.transform);
		let start: TransformType = { ...mapObject.transform };

		const handleDragMove = (e: MouseEvent) => {
			if (dragging && !resizing && drag && !destroyed) {
				mapObject.transform.x = e.clientX / $map.scale - offsetX;
				mapObject.transform.y = e.clientY / $map.scale - offsetY;
				let x: number = closestNumber(mapObject.transform.x, mapMagnetSteps);
				let y: number = closestNumber(mapObject.transform.y, mapMagnetSteps);

				mapObject!.transform.x = x;
				mapObject!.transform.y = y;
			}
		};

		const handleDragEnd = () => {
			dragging = false;
			window.removeEventListener('mousemove', handleDragMove);
			window.removeEventListener('mouseup', handleDragEnd);
			// window.removeEventListener('mousemove', updateInstantiation);

			dispatch('release', {
				obj: mapObject,
				start: start,
				destroyed: destroyed
			});
		};

		window.addEventListener('mousemove', handleDragMove);
		window.addEventListener('mouseup', handleDragEnd);
		// window.addEventListener('mousemove', updateInstantiation);
	};

	// const openModal = () => {
	// 	dispatch('openModal', mapObject);
	// };

	// not used
	const updateInstantiation = (event: MouseEvent) => {
		if (!dragging) return;

		const inBoundings: boolean = inBoundingbox(
			drag!.getBoundingClientRect(),
			drawer.getBoundingClientRect()
		);

		// if (!inBoundings && enabled) disable();
		// else if (inBoundings && !enabled) enable();
	};

	export const rerenderMapObject = () => {
		mapObject = mapObject;
	};

	export const removeSelectedStyle = () => {
		selected = false;

		grabbers.forEach((grabber) => {
			grabber.classList.remove(
				'handle',
				`handle-${grabber.title}${mapObject.type == mapObjectType.Room ? '' : '-point'}`
			);
		});
	};

	export const applySelectedStyle = () => {
		selected = true;
		grabbers.forEach((grabber) => {
			grabber.classList.add(
				'handle',
				`handle-${grabber.title}${mapObject.type == mapObjectType.Room ? '' : '-point'}`
			);
		});
	};

	export const isDragging = () => dragging;

	function resizeRectangle(element: HTMLElement) {
		let active: HTMLElement | null = null;
		right = document.createElement('div');
		right.title = 'east';
		right.classList.add('handle', 'handle-east');
		left = document.createElement('div');
		left.title = 'west';
		left.classList.add('handle', 'handle-west');
		top = document.createElement('div');
		top.title = 'north';
		top.classList.add('handle', 'handle-north');
		bottom = document.createElement('div');
		bottom.title = 'south';
		bottom.classList.add('handle', 'handle-south');
		topLeft = document.createElement('div');
		topLeft.title = 'northwest';
		topLeft.classList.add('handle', 'handle-northwest');
		topRight = document.createElement('div');
		topRight.title = 'northeast';
		topRight.classList.add('handle', 'handle-northeast');
		bottomLeft = document.createElement('div');
		bottomLeft.title = 'southwest';
		bottomLeft.classList.add('handle', 'handle-southwest');
		bottomRight = document.createElement('div');
		bottomRight.title = 'southeast';
		bottomRight.classList.add('handle', 'handle-southeast');

		grabbers = [right, left, top, bottom, topLeft, topRight, bottomLeft, bottomRight];

		let initialTransform: TransformType | null = null,
			initialPos: { x: number; y: number } | null = null;

		grabbers.forEach((grabber) => {
			element.appendChild(grabber);
			grabber.addEventListener('mousedown', onMousedown);
		});

		function onMousedown(event: MouseEvent) {
			resizing = true;
			const parent = target.parentElement!.getBoundingClientRect();
			active = event.target as HTMLElement;

			initialTransform = { ...mapObject.transform };
			initialPos = { x: event.pageX / $map.scale, y: event.pageY / $map.scale };
		}

		function onMouseup(event: MouseEvent) {
			resizing = false;
			initialTransform = null;
			initialPos = null;
		}

		function onMove(event: MouseEvent) {
			if (!active || !initialPos) return;

			const direction = active.title;
			let delta: number = 0;

			if (direction.match('east')) {
				delta = closestNumber(event.pageX / $map.scale - initialPos!.x, mapMagnetSteps);
				if (initialTransform!.width + delta < 50) return;
				mapObject.transform.width = initialTransform!.width + delta;
			}

			if (direction.match('west')) {
				delta = closestNumber(initialPos!.x - event.pageX / $map.scale, mapMagnetSteps);
				if (initialTransform!.width + delta < 50) return;
				mapObject.transform.x = initialTransform!.x - delta;
				mapObject.transform.width = initialTransform!.width + delta;
			}

			if (direction.match('north')) {
				delta = closestNumber(initialPos!.y - event.pageY / $map.scale, mapMagnetSteps);
				if (initialTransform!.height + delta < 50) return;
				mapObject.transform.y = initialTransform!.y - delta;
				mapObject.transform.height = initialTransform!.height + delta;
			}

			if (direction.match('south')) {
				delta = closestNumber(event.pageY / $map.scale - initialPos!.y, mapMagnetSteps);
				if (initialTransform!.height + delta < 50) return;
				mapObject.transform.height = initialTransform!.height + delta;
			}
		}

		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onMouseup);

		return {
			destroy() {
				window.removeEventListener('mousemove', onMove);
				window.removeEventListener('mousemove', onMousedown);

				grabbers.forEach((grabber) => {
					element.removeChild(grabber);
				});
			}
		};
	}

	function resizeWall(element: HTMLElement) {
		let active: HTMLElement | null = null;
		right = document.createElement('div');
		right.title = 'east';
		right.classList.add('handle', 'handle-east-point');
		left = document.createElement('div');
		left.title = 'west';
		left.classList.add('handle', 'handle-west-point');

		grabbers = [right, left];

		let initialTransform: TransformType | null = null,
			initialPos: { x: number; y: number } | null = null;

		grabbers.forEach((grabber) => {
			element.appendChild(grabber);
			grabber.addEventListener('mousedown', onMousedown);
		});

		function onMousedown(event: MouseEvent) {
			resizing = true;
			const parent = target.parentElement!.getBoundingClientRect();
			active = event.target as HTMLElement;

			initialTransform = { ...mapObject.transform };
			initialPos = { x: event.pageX / $map.scale, y: event.pageY / $map.scale };
		}

		function onMouseup(event: MouseEvent) {
			resizing = false;
			initialTransform = null;
			initialPos = null;
		}

		function onMove(event: MouseEvent) {
			if (!active || !initialPos) return;

			const direction = active.title;
			let delta: number = 0;

			if (direction.match('east')) {
				delta = closestNumber(event.pageX / $map.scale - initialPos!.x, mapMagnetSteps);
				if (initialTransform!.width + delta < 50) return;
				mapObject.transform.width = initialTransform!.width + delta;
			}

			if (direction.match('west')) {
				delta = closestNumber(initialPos!.x - event.pageX / $map.scale, mapMagnetSteps);
				if (initialTransform!.width + delta < 50) return;
				mapObject.transform.x = initialTransform!.x - delta;
				mapObject.transform.width = initialTransform!.width + delta;
			}
		}

		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onMouseup);

		return {
			destroy() {
				window.removeEventListener('mousemove', onMove);
				window.removeEventListener('mousemove', onMousedown);

				grabbers.forEach((grabber) => {
					element.removeChild(grabber);
				});
			}
		};
	}
</script>

{#if mapObject.type === mapObjectType.Desk}
	<div
		class="z-40 duration-0"
		style="position: absolute; height: {mapObject.transform.height}px; width: {mapObject.transform
			.width}px; left: {mapObject.transform.x + wallThickness / 2}px; top: {mapObject.transform
			.y}px; transform: rotate({mapObject.transform.rotation}deg);"
		role="button"
		tabindex="0"
		bind:this={drag}
		on:mousedown={handleDragStart}
		on:dblclick={() => dispatch('dblcDesk', mapObject)}
	>
		<DeskSvg {selected} assigned={mapObject.userId !== null} text={mapObject.id} />
	</div>
{:else if mapObject.type === mapObjectType.Room}
	<div
		class="flex justify-center duration-0"
		style="position: absolute; width: {mapObject.transform.width +
			wallThickness}px; height: {mapObject.transform.height + wallThickness}px; left: {mapObject
			.transform.x}px; top: {mapObject.transform.y - wallThickness / 2}px; z-index: {selected
			? 10
			: 10};"
		role="button"
		tabindex="0"
		bind:this={drag}
		on:mousedown={(event) => {
			// INFO: the funny:
			const extension = 4;
			if (
				selected ||
				(event.clientX >= drag.getBoundingClientRect().left - extension &&
					event.clientX <=
						drag.getBoundingClientRect().left + extension + wallThickness * $map.scale) ||
				(event.clientX >=
					drag.getBoundingClientRect().left -
						extension +
						(mapObject.transform.width + wallThickness) * $map.scale -
						wallThickness * $map.scale &&
					event.clientX <=
						drag.getBoundingClientRect().left +
							extension +
							(mapObject.transform.width + wallThickness) * $map.scale) ||
				(event.clientY >= drag.getBoundingClientRect().top - extension &&
					event.clientY <=
						drag.getBoundingClientRect().top + extension + wallThickness * $map.scale) ||
				(event.clientY >=
					drag.getBoundingClientRect().top -
						extension +
						(mapObject.transform.height + wallThickness) * $map.scale -
						wallThickness * $map.scale &&
					event.clientY <=
						drag.getBoundingClientRect().top +
							extension +
							(mapObject.transform.height + wallThickness) * $map.scale)
			)
				handleDragStart(event);
			else if (!selected) {
				dispatch('resetSelection');
			}
		}}
		use:resizeRectangle
	>
		<RoomSvg
			height={mapObject.transform.height + wallThickness}
			width={mapObject.transform.width + wallThickness}
			{selected}
		/>
	</div>
{:else if mapObject.type === mapObjectType.Wall}
	<div
		class="flex justify-center z-20 duration-0 -translate-y-1/2"
		style="position: absolute; width: {mapObject.transform.width +
			wallThickness}px; height: {mapObject.transform.height}px; left: {mapObject.transform
			.x}px; top: {mapObject.transform.y}px;"
		role="button"
		tabindex="0"
		bind:this={drag}
		on:mousedown={handleDragStart}
		use:resizeWall
	>
		<WallSvg
			height={mapObject.transform.height}
			width={mapObject.transform.width + wallThickness}
			{selected}
		/>
	</div>
{:else if mapObject.type === mapObjectType.Door}
	<div
		class="flex justify-center z-30 duration-0 -translate-y-1/2"
		style="position: absolute; width: {mapObject.transform.width +
			wallThickness}px; height: {mapObject.transform.height}px; left: {mapObject.transform
			.x}px; top: {mapObject.transform.y}px;"
		role="button"
		tabindex="0"
		bind:this={drag}
		on:mousedown={handleDragStart}
		use:resizeWall
	>
		<DoorSvg
			height={mapObject.transform.height}
			width={mapObject.transform.width + wallThickness}
			{selected}
		/>
	</div>
{:else if mapObject.type === mapObjectType.Label}
	<div
		class="flex justify-center z-50 duration-0 -translate-y-1/2"
		style="position: absolute; width: {mapObject.transform.width +
			wallThickness}px; height: {mapObject.transform.height}px; left: {mapObject.transform.x -
			wallThickness / 2}px; top: {mapObject.transform.y + wallThickness}px;"
		role="button"
		tabindex="0"
		bind:this={drag}
		on:mousedown={handleDragStart}
	>
		<input
			type="text"
			placeholder="Label"
			bind:value={mapObject.text}
			class="text-primary-500 bg-transparent
				border-transparent
				text-center"
			style="  width: {mapObject.transform.width}px; height: {mapObject.transform.height +
				wallThickness}px;"
		/>
	</div>
{/if}
