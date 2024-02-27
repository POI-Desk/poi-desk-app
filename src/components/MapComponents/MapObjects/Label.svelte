<script lang="ts">
	import { labelProps } from '$lib/map/props';

	export let text: string;
	export let z: number = 0;
	export let transform: { x: number; y: number; rotation: number } = {
		x: 0,
		y: 0,
		rotation: 0
	};

	let width = labelProps.width;
	let height = labelProps.height;

	const style: string = `position: absolute; left: ${transform.x}px; top: ${transform.y}px;`;
</script>

<div class="z-{z}" {style}>
	<svg {width} {height}>
		<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#1A4775">
			{text}
		</text>
	</svg>
</div>
