<script lang="ts">
	import { wallThickness } from '$lib/map/props';
	import type { TransformType } from '$lib/types/transformType';
	import { createEventDispatcher } from 'svelte';

	export let width: number;
	export let height: number;
	export let selected: boolean = false;
	export let booked: boolean = false;
	export let text: string;
	export let z: number = 0;
	export let useAsMain: boolean = false;
	export let transform: { x: number; y: number; rotation: number } = {
		x: 0,
		y: 0,
		rotation: 0
	};

	const dispatch = createEventDispatcher();

	const style: string = `position: absolute; left: ${transform.x + wallThickness / 2}px; top: ${
		transform.y
	}px;`;
</script>

<button
	class="z-{z}"
	style={useAsMain ? style : ''}
	on:touchend={() => dispatch('click')}
	on:click={() => dispatch('click')}
>
	<svg {width} {height}>
		<rect
			x="1"
			y="1"
			width={width - 2}
			height={height - 2}
			rx="2"
			ry="2"
			fill={booked ? '#EB5E28' : '#1A4775'}
			stroke={selected ? '#8B80F9' : '#000000'}
			stroke-width="2"
		/>
		<text
			x="5"
			y={height - 5}
			fill="white"
			font-size="12"
			style="user-select: none;"
			width="mapObject.transform.width"
			height="mapObject.transform.height">{text}</text
		>
	</svg>
</button>
