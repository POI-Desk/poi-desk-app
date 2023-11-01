<!-- TODO: make selected object on top of other object -->
<!-- TODO: look into the is in grid check -->
<!-- TODO: better border for rooms (svg maby (probably)) -->

<script lang="ts">
	import { closestNumber, inBoundingbox, transformPosition } from '$lib/map/helper';
	import { mapMagnetSteps, mapObjectType, wallProps } from '$lib/map/props';
	import { map } from '$lib/stores/mapCreationStore';
	import type { MapObject } from '$lib/types/mapObjectTypes';
	import type { TransformType } from '$lib/types/transformType';
	import { createEventDispatcher, onMount } from 'svelte';
	//Look into this so import is not needed
	import '../../styles/handles.css';

	export let mapObject: MapObject;
	export let enabled: boolean = false;
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
		if (enabled) enable();
		else disable();

		mapObject.transform.x = mapObject.transform.x * $map.scale;
		mapObject.transform.y = mapObject.transform.y * $map.scale;
		handleDragStart(new MouseEvent('mousedown', { clientX: initMouseX, clientY: initMouseY }));
		const offsetX = initMouseX / $map.scale - mapObject.transform.x;
		const offsetY = initMouseY / $map.scale - mapObject.transform.y;
		const x = initMouseX / $map.scale - offsetX;
		const y = initMouseY / $map.scale - offsetY;
		const wallOffset = mapObject.type == mapObjectType.Room ? wallProps.height / 2 : 0;
		mapObject.transform.x = enabled ? closestNumber(x, mapMagnetSteps) - wallOffset : x;
		mapObject.transform.y = enabled ? closestNumber(y, mapMagnetSteps) - wallOffset : y;
	});

	const enable = () => {
		enabled = true;
		drag?.style.setProperty('opacity', '1');
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

	const handleDragStart = (event: MouseEvent) => {
		dragging = true;
		offsetX = event.clientX / (enabled ? $map.scale : 1) - mapObject.transform.x;
		offsetY = event.clientY / (enabled ? $map.scale : 1) - mapObject.transform.y;
		dispatch('select', mapObject.transform);
		applySelectedStyle();

		const handleDragMove = (e: MouseEvent) => {
			if (dragging && !resizing) {
				mapObject.transform.x = e.clientX / (enabled ? $map.scale : 1) - offsetX;
				mapObject.transform.y = e.clientY / (enabled ? $map.scale : 1) - offsetY;
				let x: number = enabled
					? closestNumber(mapObject.transform.x, mapMagnetSteps)
					: mapObject.transform.x;
				let y: number = enabled
					? closestNumber(mapObject.transform.y, mapMagnetSteps)
					: mapObject.transform.y;

				mapObject!.transform.x = x;
				mapObject!.transform.y = y;
			}
		};

		const handleDragEnd = () => {
			dragging = false;
			window.removeEventListener('mousemove', handleDragMove);
			window.removeEventListener('mouseup', handleDragEnd);
			window.removeEventListener('mousemove', updateInstantiation);
			dispatch('release', {
				transform: mapObject.transform,
				enabled
			});
		};

		window.addEventListener('mousemove', handleDragMove);
		window.addEventListener('mouseup', handleDragEnd);
		window.addEventListener('mousemove', updateInstantiation);
	};

	const updateInstantiation = (event: MouseEvent) => {
		if (!dragging) return;

		const inBoundings: boolean = inBoundingbox(
			drag!.getBoundingClientRect(),
			drawer.getBoundingClientRect()
		);

		if (!inBoundings && enabled) disable();
		else if (inBoundings && !enabled) enable();
	};

	export const rerenderPosition = () => {
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
			.width}px; left: {mapObject.transform.x}px; top: {mapObject.transform
			.y}px; transform: rotate({mapObject.transform.rotation}deg);"
		bind:this={drag}
		on:mousedown={handleDragStart}
		role="button"
		tabindex="0"
	>
		<svg width={mapObject.transform.width} height={mapObject.transform.height}>
			<rect
				width={mapObject.transform.width}
				height={mapObject.transform.height}
				fill="#000000"
				rx="5"
				ry="5"
				stroke={selected ? '#8B80F9' : ''}
				stroke-width="4"
			/>
		</svg>
	</div>
{:else if mapObject.type === mapObjectType.Room}
	<button
		class="flex justify-center z-10 duration-0"
		style="position: absolute; width: {mapObject.transform.width}px; height: {mapObject.transform
			.height}px; left: {mapObject.transform.x}px; top: {mapObject.transform.y -
			wallProps.height / 2}px;"
		bind:this={drag}
		on:mousedown={handleDragStart}
		use:resizeRectangle
	>
		<svg width={mapObject.transform.width} height={mapObject.transform.height}>
			<rect
				width={mapObject.transform.width}
				height={mapObject.transform.height}
				fill-opacity="0"
				stroke={selected ? '#8B80F9' : '#000000'}
				stroke-width={wallProps.height * 2}
			/>
		</svg>
	</button>
{:else if mapObject.type === mapObjectType.Wall}
	<button
		class="flex justify-center z-20 duration-0 -translate-y-1/2"
		style="position: absolute; width: {mapObject.transform.width}px; height: {mapObject.transform
			.height}px; left: {mapObject.transform.x}px; top: {mapObject.transform.y}px;"
		bind:this={drag}
		on:mousedown={handleDragStart}
		use:resizeWall
	>
		<svg width={mapObject.transform.width} height={mapObject.transform.height}>
			<rect
				width={mapObject.transform.width}
				height={mapObject.transform.height}
				fill-opacity={selected ? 0 : 1}
				fill={selected ? '' : '#000000'}
				stroke={selected ? '#8B80F9' : ''}
				stroke-width="4"
			/>
		</svg>
	</button>
{:else if mapObject.type === mapObjectType.Door}
	<button
		class="flex justify-center z-30 duration-0 -translate-y-1/2"
		style="position: absolute; width: {mapObject.transform.width}px; height: {mapObject.transform
			.height}px; left: {mapObject.transform.x}px; top: {mapObject.transform.y}px;"
		bind:this={drag}
		on:mousedown={handleDragStart}
		use:resizeWall
	>
		<svg width={mapObject.transform.width} height={mapObject.transform.height}>
			<rect width={mapObject.transform.width} height={mapObject.transform.height} fill="#D9D9D9" />
			<rect
				x={mapObject.transform.width - wallProps.height}
				width={wallProps.height}
				height={mapObject.transform.height}
			/>
			<rect width={wallProps.height} height={mapObject.transform.height} />
			{#if selected}
				<rect
					width={mapObject.transform.width}
					height={mapObject.transform.height}
					fill-opacity="0"
					stroke="#8B80F9"
					stroke-width="4"
				/>
			{/if}
		</svg>
	</button>
{/if}
