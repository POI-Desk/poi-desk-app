<!-- TODO: make selected object on top of other object -->
<!-- TODO: look into the is in grid check -->
<!-- TODO: better border for rooms (svg maby (probably)) -->

<script lang="ts">
	import { closestNumber, inBoundingbox, transformPosition } from '$lib/map/helper';
	import { mapObjectType } from '$lib/map/props';
	import { map } from '$lib/stores/mapCreationStore';
	import type { MapObject } from '$lib/types/mapObjectTypes';
	import type { TransformType } from '$lib/types/transformType';
	import { createEventDispatcher, onMount } from 'svelte';
	import '../../styles/handles.css';

	export let mapObject: MapObject;
	export let enabled: boolean = false;
	export let target: HTMLElement;
	export let main: HTMLElement;
	export let drawer: HTMLElement;
	export let initMouseX: number = 0;
	export let initMouseY: number = 0;

	let drag: HTMLElement;
	let dragging: boolean = false;
	let resizing: boolean = false;
	let offsetX: number = 0;
	let offsetY: number = 0;

	// export const setCoords = (x: number, y: number) => {
	// 	left = x;
	// 	top = y;
	// };

	let dispatch = createEventDispatcher();

	onMount(() => {
		if (enabled) enable();
		else disable();

		mapObject.transform.x = mapObject.transform.x * $map.scale;
		mapObject.transform.y = mapObject.transform.y * $map.scale;
		handleDragStart(new MouseEvent('mousedown', { clientX: initMouseX, clientY: initMouseY }));
		const offsetX = initMouseX / $map.scale - mapObject.transform.x;
		const offsetY = initMouseY / $map.scale - mapObject.transform.y;
		const x = initMouseX / $map.scale - offsetX;
		const y = initMouseY / $map.scale - offsetY;
		mapObject.transform.x = enabled ? closestNumber(x, 25) : x;
		mapObject.transform.y = enabled ? closestNumber(y, 25) : y;
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
		drag.style.setProperty('border', '1px solid red');

		const handleDragMove = (e: MouseEvent) => {
			if (dragging && !resizing) {
				mapObject.transform.x = e.clientX / (enabled ? $map.scale : 1) - offsetX;
				mapObject.transform.y = e.clientY / (enabled ? $map.scale : 1) - offsetY;
				let x: number = enabled ? closestNumber(mapObject.transform.x, 25) : mapObject.transform.x;
				let y: number = enabled ? closestNumber(mapObject.transform.y, 25) : mapObject.transform.y;

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
		drag?.style.removeProperty('border');
	};

	function resize(element: HTMLElement) {
		let active: HTMLElement | null = null;

		const right = document.createElement('div');
		right.title = 'east';
		right.classList.add('handle');
		right.classList.add('handle-east');

		const left = document.createElement('div');
		left.title = 'west';
		left.classList.add('handle');
		left.classList.add('handle-west');

		const top = document.createElement('div');
		top.title = 'north';
		top.classList.add('handle');
		top.classList.add('handle-north');

		const bottom = document.createElement('div');
		bottom.title = 'south';
		bottom.classList.add('handle');
		bottom.classList.add('handle-south');

		const topLeft = document.createElement('div');
		topLeft.title = 'northwest';
		topLeft.classList.add('handle');
		topLeft.classList.add('handle-northwest');

		const topRight = document.createElement('div');
		topRight.title = 'northeast';
		topRight.classList.add('handle');
		topRight.classList.add('handle-northeast');

		const bottomLeft = document.createElement('div');
		bottomLeft.title = 'southwest';
		bottomLeft.classList.add('handle');
		bottomLeft.classList.add('handle-southwest');

		const bottomRight = document.createElement('div');
		bottomRight.title = 'southeast';
		bottomRight.classList.add('handle');
		bottomRight.classList.add('handle-southeast');

		const grabbers = [right, left, top, bottom, topLeft, topRight, bottomLeft, bottomRight];

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
			initialPos = { x: event.pageX, y: event.pageY };
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
				delta = closestNumber(event.pageX - initialPos!.x, 25);
				if (initialTransform!.width + delta < 50) return;
				mapObject.transform.width = initialTransform!.width + delta;
			}

			if (direction.match('west')) {
				delta = closestNumber(initialPos!.x - event.pageX, 25);
				if (initialTransform!.width + delta < 50) return;
				mapObject.transform.x = initialTransform!.x - delta;
				mapObject.transform.width = initialTransform!.width + delta;
			}

			if (direction.match('north')) {
				delta = closestNumber(initialPos!.y - event.pageY, 25);
				if (initialTransform!.height + delta < 50) return;
				mapObject.transform.y = initialTransform!.y - delta;
				mapObject.transform.height = initialTransform!.height + delta;
			}

			if (direction.match('south')) {
				delta = closestNumber(event.pageY - initialPos!.y, 25);
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
</script>

{#if mapObject.type === mapObjectType.Desk}
	<button
		class="btn no-animation z-20 duration-0 variant-filled"
		style="position: absolute; height: {mapObject.transform.height}px; width: {mapObject.transform
			.width}px; left: {mapObject.transform.x}px; top: {mapObject.transform
			.y}px; transform: rotate({mapObject.transform.rotation}deg);"
		bind:this={drag}
		on:mousedown={handleDragStart}>T</button
	>
{:else if mapObject.type === mapObjectType.Room}
	<button
		class="flex justify-center z-10 duration-0 border-solid border-black border-2 border-collapse"
		style="position: absolute; width: {mapObject.transform.width}px; height: {mapObject.transform
			.height}px; left: {mapObject.transform.x}px; top: {mapObject.transform.y}px;"
		bind:this={drag}
		on:mousedown={handleDragStart}
		use:resize
	>
		Room
	</button>
{/if}
