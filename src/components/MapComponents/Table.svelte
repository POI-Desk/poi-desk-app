<script lang="ts">
	import { createEventDispatcher, onMount } from 'svelte';
	export let initX: number = 0;
	export let initY: number = 0;
	export let initMouseX: number = 0;
	export let initMouseY: number = 0;
	export let initDrag: boolean = false;


	let drag: HTMLElement;
	let left: number = 0;
	let top: number = 0;
	let dragging = false;

	let position: number[] = [0, 0];
	let dispatch = createEventDispatcher();

	onMount(() => {
		left = initX;
		top = initY;
		if(initDrag){
			handleDragStart(new MouseEvent('mousedown', {clientX: initMouseX, clientY: initMouseY}));
		}
	});

	function closestNumber(n: number, m: number) {
		// find the quotient
		let q = Math.floor(n / m);

		let n1 = m * q;

		let n2 = n * m > 0 ? m * (q + 1) : m * (q - 1);

		if (Math.abs(n - n1) < Math.abs(n - n2)) return n1;

		return n2;
	}
	function handleDragStart(event: MouseEvent) {
		dragging = true;
		const offsetX = event.clientX - left;
		const offsetY = event.clientY - top;

		const handleDragMove = (e: MouseEvent) => {
			if (dragging) {
				left = e.clientX - offsetX;
				top = e.clientY - offsetY;
				drag.style.left = `${closestNumber(left, 25)}px`;
				drag.style.top = `${closestNumber(top, 25)}px`;
			}
		};

		const handleDragEnd = () => {
			dragging = false;
			window.removeEventListener('mousemove', handleDragMove);
			window.removeEventListener('mouseup', handleDragEnd);
		};

		window.addEventListener('mousemove', handleDragMove);
		window.addEventListener('mouseup', handleDragEnd);
	}

	const updatePosition = () => {
		position = [left, top];
		dispatch('updatePosition', position);
	};
</script>

<button
	class="btn no-animation"
	style="position: absolute; height: 50px; width: 50px; left: {initX}px; top: {initY}px; transform: translate(-50%, -50%);"
	bind:this={drag}
	on:mousedown={handleDragStart}
	on:mouseup={updatePosition}
	on:click={drag.remove}
	>I</button
>
