<script lang="ts">
	import { deskProps, wallThickness } from "$lib/map/props";
	import { createEventDispatcher } from "svelte";

	let width: number = deskProps.width;
	let height: number = deskProps.height;
	export let selected: boolean = false;
	export let assigned = false;
	export let bookedMorning: boolean = false;
	export let bookedAfternoon: boolean = false;
	export let text: string;
	export let z: number = 0;
	export let useAsMain: boolean = false;
	export let transform: { x: number; y: number; rotation: number } = {
		x: 0,
		y: 0,
		rotation: 0
	};

  export const getBookedMorning = () => {
    return bookedMorning;
  };

  export const getBookedAfternoon = () => {
    return bookedAfternoon;
  };

  export const setBookedMorning = (isBookedMorning: boolean) => {
    bookedMorning = isBookedMorning;
  };

  export const setBookedAfternoon = (isBookedAfternoon: boolean) => {
    bookedAfternoon = isBookedAfternoon;
  };

  export const setSelected = (isSelected: boolean) => {
    selected = isSelected;
  };

  export const setText = (newText: string) => {
    text = newText;
  };
	const freeColor: string = '#ffffff';
	const bookedColor: string = '#A8ADB3';
	const assignedColor: string = '#FF4538';
	//E680BA
	//red: FF4538

  const dispatch = createEventDispatcher();

  const borderThickness: number = 3;

  const style: string = `position: absolute; left: ${transform.x + wallThickness / 2}px; top: ${
    transform.y
  }px;`;
</script>

<button
  class="z-{z}"
  style={useAsMain ? style : ''}
  on:touchend={() => dispatch('click')}
  on:click={() => dispatch('click')}
>
	<svg {width} {height}>
		<rect
			x={borderThickness / 2}
			y={borderThickness / 2}
			width={width - borderThickness}
			height={height - borderThickness}
			rx="2"
			ry="2"
			stroke={selected ? '#8B80F9' : '#1A4775'}
			stroke-width={borderThickness}
			fill={bookedMorning || bookedAfternoon ? bookedColor : assigned ? assignedColor : freeColor}
		/>
		<polygon
			points="{borderThickness},{borderThickness} {width -
				borderThickness},{borderThickness} {borderThickness},{height - borderThickness}"
			fill={bookedMorning ? bookedColor : assigned ? assignedColor : freeColor}
			stroke="none"
		/>
		<polygon
			points="{width - borderThickness},{height - borderThickness} {width -
				borderThickness},{borderThickness} {borderThickness},{height - borderThickness}"
			fill={bookedAfternoon ? bookedColor : assigned ? assignedColor : freeColor}
			stroke="none"
		/>
		<text
			x="50%"
			y="50%"
			text-anchor="middle"
			dominant-baseline="middle"
			fill="#1A4775"
			font-size="16"
			font-weight="bold"
			style="user-select: none;">{text}</text
		>
	</svg>
</button>
