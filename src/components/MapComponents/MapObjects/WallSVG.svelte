<script lang="ts">
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
