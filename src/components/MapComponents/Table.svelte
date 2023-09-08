<script lang="ts">
	import { closestNumber, inBoundingbox, transformPosition } from '$lib/helper';
	import { selectedSeat } from '$lib/seatStore';
	import { createEventDispatcher, onMount } from 'svelte';
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
	export let seatnum: string = '';

	let drag: HTMLElement | null;
	let left: number = 0;
	let top: number = 0;
	let dragging: boolean = false;
	let offsetX: number = 0;
	let offsetY: number = 0;

	let position = {
		x: 0,
		y: 0
	};
	let dispatch = createEventDispatcher();

	onMount(() => {
		if (enabled) enable();
		else disable();

		drag!.style.left = initX + 'px';
		drag!.style.top = initY + 'px';
		left = initX / scale;
		top = initY / scale;
		$selectedSeat = {
			element: drag,
			seat: {
				seatnum: seatnum,
				x: initX,
				y: initY
			}
		};
		if (initDrag) {
			handleDragStart(new MouseEvent('mousedown', { clientX: initMouseX, clientY: initMouseY }));
			const offsetX = initMouseX / scale - left;
			const offsetY = initMouseY / scale - top;
			left = initMouseX / scale - offsetX;
			top = initMouseY / scale - offsetY;
			drag!.style.left = `${enabled ? closestNumber(left, 25) : left}px`;
			drag!.style.top = `${enabled ? closestNumber(top, 25) : top}px`;
		}
	});

	const enable = () => {
		enabled = true;
		drag?.style.setProperty('opacity', '1');
		const transformedPos = transformPosition(
			drag!.getBoundingClientRect(),
			main.getBoundingClientRect()
		);

		if (drag?.parentElement) drag?.parentElement.removeChild(drag!);
		target.appendChild(drag!);
		offsetX += target.getBoundingClientRect().x / scale;
		offsetY += target.getBoundingClientRect().y / scale;

		drag!.style.left = transformedPos.x / scale - offsetX + 'px';
		drag!.style.top = transformedPos.y / scale - offsetY + 'px';
	};

	const disable = () => {
		enabled = false;
		drag?.style.setProperty('opacity', '0.7');
		const transformedPos = transformPosition(
			drag!.getBoundingClientRect(),
			target.getBoundingClientRect()
		);

		if (drag?.parentElement) drag?.parentElement.removeChild(drag!);
		main.appendChild(drag!);
		offsetX -= target.getBoundingClientRect().x / scale;
		offsetY -= target.getBoundingClientRect().y / scale;

		drag!.style.left = transformedPos.x / scale - offsetX + 'px';
		drag!.style.top = transformedPos.y / scale - offsetY + 'px';
	};

	const handleDragStart = (event: MouseEvent) => {
		dragging = true;
		drag?.style.setProperty('border', '1px solid red');
		offsetX = event.clientX / (enabled ? scale : 1) - left;
		offsetY = event.clientY / (enabled ? scale : 1) - top;

		dispatch('selectTable', { drag, seatnum });

		const handleDragMove = (e: MouseEvent) => {
			if (dragging) {
				left = e.clientX / (enabled ? scale : 1) - offsetX;
				top = e.clientY / (enabled ? scale : 1) - offsetY;
				let x = closestNumber(left, 25);
				let y = closestNumber(top, 25);

				drag!.style.left = `${x}px`;
				drag!.style.top = `${y}px`;
				$selectedSeat.seat!.x = x;
				$selectedSeat.seat!.y = y;
			}
		};

		const handleDragEnd = () => {
			dragging = false;
			window.removeEventListener('mousemove', handleDragMove);
			window.removeEventListener('mouseup', handleDragEnd);
			window.removeEventListener('mousemove', updateInstantiation);
			position = {
				x: left,
				y: top
			};
			dispatch('releaseTable', { left, top, enabled });
		};

		window.addEventListener('mousemove', handleDragMove);
		window.addEventListener('mouseup', handleDragEnd);
		window.addEventListener('mousemove', updateInstantiation);
	};

	const updateInstantiation = (event: MouseEvent) => {
		if (!dragging) return;

		const dragBoundings: DOMRect = drag!.getBoundingClientRect();
		const inBoundings: boolean = inBoundingbox(
			dragBoundings.left,
			dragBoundings.top,
			drawer.getBoundingClientRect(),
			scale
		);

		if (inBoundings && enabled) disable();
		else if (!inBoundings && !enabled) enable();
	};
</script>

<!-- Button needs to be over seletion drawer in page when disabled and under when enabled -->
<button
	class="btn no-animation z-20"
	style="position: absolute; height: 50px; width: 100px;"
	bind:this={drag}
	on:mousedown={handleDragStart}>T</button
>
