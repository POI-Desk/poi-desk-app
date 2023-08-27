<script lang="ts">
	import { marshalSelection } from '$houdini';
	import { createEventDispatcher } from 'svelte';

	let left = 0;
	let top = 0;
	let drag: HTMLElement;
	let dragging = false;

	let position: number[] = [0, 0];
	let dispatch = createEventDispatcher();
	function closestNumber(n: number, m: number) {
		// find the quotient
		let q = Math.floor(n / m);
		console.log(q, n, m);

		// 1st possible closest number
		let n1 = m * q;

		// 2nd possible closest number
		let n2 = n * m > 0 ? m * (q + 1) : m * (q - 1);

		// if true, then n1 is the
		// required closest number
		if (Math.abs(n - n1) < Math.abs(n - n2)) return n1;

		// else n2 is the required
		// closest number
		return n2;
	}
	function handleDragStart(event: any) {
		dragging = true;
		const offsetX = event.clientX - left;
		const offsetY = event.clientY - top;

		const handleDragMove = (e: any) => {
			if (dragging) {
				left = e.clientX - offsetX;
				top = e.clientY - offsetY;
				drag.style.left = `${closestNumber(left, 10)}px`;
				drag.style.top = `${closestNumber(top, 10)}px`;
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
	style="position: absolute; height: 50px; width: 50px;"
	bind:this={drag}
	on:mousedown={handleDragStart}
	on:mouseup={updatePosition}>I</button
>
