<script lang="ts">
	import { wallProps, wallThickness } from '$lib/map/props';
	export let width: number;
	export let height: number;
	export let selected: boolean = false;
	export let z: number = 0;
  export let useAsMain: boolean = false;
  export let transform: {x: number, y: number, rotation: number} = {
    x: 0,
    y: 0,
    rotation: 0,
  };

  const style: string = `position: absolute; left: ${transform.x}px; top: ${transform.y}px;`;
</script>

<div class="z-{z}" style="{useAsMain ? style : ""}">
	<svg {width} {height}>
		<rect {width} {height} fill="#dbd3e1" />
		<rect x={width - wallProps.height} width={wallProps.height} {height} />
		<rect width={wallProps.height} {height} />
		{#if selected}
			<rect {width} {height} fill-opacity="0" stroke="#8B80F9" stroke-width="4" />
		{/if}
	</svg>
</div>
