<script lang="ts">
	import { wallProps } from '$lib/map/props';

	export let width: number;
	export let height: number;
	export let selected: boolean = false;
	export let z: number = 0;
</script>

<div class="z-[{z}]">
	<svg {width} {height}>
		<rect
			{width}
			{height}
			fill-opacity="0"
			stroke={selected ? '#8B80F9' : '#000000'}
			stroke-width={wallProps.height * 2}
		/>
	</svg>
</div>
