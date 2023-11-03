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
			x="1"
			y="1"
			width={width - 2}
			height={height - 2}
			rx="2"
			ry="2"
			fill="#1A4775"
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
</div>
