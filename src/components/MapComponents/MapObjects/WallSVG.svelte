<script lang="ts">
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
			fill-opacity={selected ? 0 : 1}
			fill={selected ? '' : '#000000'}
			stroke={selected ? '#8B80F9' : ''}
			stroke-width="4"
		/>
	</svg>
</div>
