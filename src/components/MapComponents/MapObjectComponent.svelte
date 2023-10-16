<script lang="ts">
	import { closestNumber, inBoundingbox, transformPosition } from '$lib/map/helper';
	import { deskProps, mapObjectType } from '$lib/map/props';
	import { createEventDispatcher, onMount } from 'svelte';
	import type { MapObject, MapObjectType } from '$lib/types/mapObjectTypes';
	import { allMapObjects, selectedMapObject } from '$lib/stores/mapObjectStore';
	import { map } from '$lib/stores/mapCreationStore';

	export let mapObject: MapObject;
	export let enabled: boolean = false;
	export let target: HTMLElement;
	export let main: HTMLElement;
	export let drawer: HTMLElement;
	export let initMouseX: number = 0;
	export let initMouseY: number = 0;
	export let mapObjectNum: string = '';

	let drag: HTMLElement | null;
	let dragging: boolean = false;
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

		mapObject.transform.x = mapObject.transform.x / $map.scale;
		mapObject.transform.y = mapObject.transform.y / $map.scale;
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
		drag?.style.setProperty('border', '1px solid red');
		offsetX = event.clientX / (enabled ? $map.scale : 1) - mapObject.transform.x;
		offsetY = event.clientY / (enabled ? $map.scale : 1) - mapObject.transform.y;

		dispatch('selectDesk', { drag, mapObjectNum });

		const handleDragMove = (e: MouseEvent) => {
			if (dragging) {
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
			dispatch('releaseDesk', {
				left: closestNumber(mapObject.transform.x, 25),
				top: closestNumber(mapObject.transform.y, 25),
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
</script>

{#if mapObject.type === mapObjectType.Desk}
	<button
		class="btn no-animation z-20 duration-0 variant-filled"
		style="position: absolute; height: {mapObject.transform.height}px; width: {mapObject.transform
			.width}px; transform: translate(-50%, -50%); left: {mapObject.transform.x}px; top: {mapObject
			.transform.y}px;"
		bind:this={drag}
		on:mousedown={handleDragStart}>T</button
	>
{:else if mapObject.type === mapObjectType.Room}
	<div
		bind:this={drag}
		class="z-20 duration-0"
		style="position: absolute; width: {mapObject.transform.width}px; height: {mapObject.transform
			.height}px; left: {mapObject.transform.x}px; top: {mapObject.transform
			.y}px; transform: translate(-50%, -50%);"
	>
		Room
	</div>
{/if}
