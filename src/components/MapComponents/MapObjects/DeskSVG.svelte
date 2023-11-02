<script lang="ts">
	export let width: number;
	export let height: number;
	export let selected: boolean = false;
	export let text: string;
	export let z: number = 0;
</script>

<div class="z-[{z}]">
	<svg {width} {height}>
		<rect
			{width}
			{height}
			fill="#000000"
			rx="5"
			ry="5"
			stroke={selected ? '#8B80F9' : ''}
			stroke-width="4"
		/>
		<text
			x="5"
			y={height - 5}
			fill="white"
			font-size="12"
			class="select-none"
			width="mapObject.transform.width"
			height="mapObject.transform.height">{text}</text
		>
	</svg>
</div>
