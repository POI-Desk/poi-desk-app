<script lang="ts">
	import { labelProps } from '$lib/map/props';

	export let text: string;
	export let z: number = 0;
	export let transform: { x: number; y: number; width: number; height: number; rotation: number } =
		{
			x: 0,
			y: 0,
			width: labelProps.width,
			height: labelProps.height,
			rotation: 0
		};

	const style: string = `position: absolute; width: ${transform.width}px; height: ${transform.height}px; left: ${transform.x}px; top: ${transform.y}px;`;
</script>

<p
	class="z-{z} 
		text-primary-500
		bg-transparent
		border-transparent
		text-center
		resize-none
		overflow-hidden
		select-none
		break-words
		py-2
		px-3"
	{style}
>
	{text}

	<!-- <svg width={transform.width} height={transform.height}>
		<text x="50%" y="50%" text-anchor="middle" dominant-baseline="middle" fill="#1A4775">
			{text}
		</text>
	</svg> -->
</p>
