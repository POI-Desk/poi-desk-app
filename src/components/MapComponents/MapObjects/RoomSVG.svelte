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

  const style: string = `position: absolute; left: ${transform.x}px; top: ${transform.y - wallThickness / 2}px;`;
</script>

<div class="z-{z}" style="{useAsMain ? style : ""}">
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
