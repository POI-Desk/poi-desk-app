<script lang="ts">
	import { wallProps } from '$lib/map/props';
	export let width: number;
	export let height: number;
	export let selected: boolean = false;
	export let z: number = 0;
</script>

<div class="z-[{z}]">
	<svg {width} {height}>
		<rect {width} {height} fill="#D9D9D9" />
		<rect x={width - wallProps.height} width={wallProps.height} {height} />
		<rect width={wallProps.height} {height} />
		{#if selected}
			<rect {width} {height} fill-opacity="0" stroke="#8B80F9" stroke-width="4" />
		{/if}
	</svg>
</div>
