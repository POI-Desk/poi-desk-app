<script lang="ts">
	import { selectedRoom } from "$lib/map/creator/roomStore";
	import { closestNumber, inBoundingbox, transformPosition } from "$lib/map/helper";
	import { roomProps } from "$lib/map/props";
	import { createEventDispatcher } from "svelte";
	export let enabled: boolean = false;
	export let target: HTMLElement;
	export let main: HTMLElement;
	export let drawer: HTMLElement;
	export let initX: number = 0;
	export let initY: number = 0;
	export let scale: number = 1;
	export let initMouseX: number = 0;
	export let initMouseY: number = 0;
	export let initDrag: boolean = false;
	export let desknum: string = '';

	let drag: HTMLElement | null;
	let left: number = 0;
	let top: number = 0;
	let dragging: boolean = false;
	let offsetX: number = 0;
	let offsetY: number = 0;

	export const setCoords = (x: number, y: number) => {
		left = x;
		top = y;
	};

	let dispatch = createEventDispatcher();

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
		offsetX += target.getBoundingClientRect().left / scale;
		offsetY += target.getBoundingClientRect().top / scale;

		left = transformedPos.x / scale - offsetX;
		top = transformedPos.y / scale - offsetY;

		drag!.style.left = left + 'px';
		drag!.style.top = top + 'px';
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
		offsetX -= target.getBoundingClientRect().left / scale;
		offsetY -= target.getBoundingClientRect().top / scale;

		left = transformedPos.x / scale - offsetX;
		top = transformedPos.y / scale - offsetY;

		drag!.style.left = left + 'px';
		drag!.style.top = top + 'px';
	};

  const handleDragStart = (event: MouseEvent) => {
		dragging = true;
		drag?.style.setProperty('border', '1px solid red');
		offsetX = event.clientX / (enabled ? scale : 1) - left;
		offsetY = event.clientY / (enabled ? scale : 1) - top;

		dispatch('selectWall', { drag, desknum });

		const handleDragMove = (e: MouseEvent) => {
			if (dragging) {
				left = e.clientX / (enabled ? scale : 1) - offsetX;
				top = e.clientY / (enabled ? scale : 1) - offsetY;
				let x = enabled ? closestNumber(left, 25) : left;
				let y = enabled ? closestNumber(top, 25) : top;

				drag!.style.left = `${x}px`;
				drag!.style.top = `${y}px`;
				$selectedRoom.room!.x = x;
				$selectedRoom.room!.y = y;
			}
		};

		const handleDragEnd = () => {
			dragging = false;
			window.removeEventListener('mousemove', handleDragMove);
			window.removeEventListener('mouseup', handleDragEnd);
			window.removeEventListener('mousemove', updateInstantiation);
			dispatch('releaseTable', {
				left: closestNumber(left, 25),
				top: closestNumber(top, 25),
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

</script>

<div class="bg-black z-20" style="position: absolute; width: {roomProps.width}px; height: {roomProps.height}px; transform: translate(-50%, -50%);">

</div>