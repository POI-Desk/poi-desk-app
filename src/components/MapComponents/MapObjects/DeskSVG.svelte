<script lang="ts">
	import { deskProps, wallThickness } from '$lib/map/props';
	import { createEventDispatcher } from 'svelte';
	import { isExtended } from '$lib/stores/extendedUserStore';
	import { interval } from '$lib/bookingStore.js';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import { Button } from '$lib/components/ui/button';
	import ModalBooking from '$components/SetBookingComponents/ModalContents/ModalBooking.svelte';
	import { mediaQuery } from 'svelte-legos';

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
	const freeColor: string = '#D1F3FF';
	const bookedColor: string = '#9EBBD9';
	const assignedColor: string = '#FF4538';
	//E680BA
	//red: FF4538

	const dispatch = createEventDispatcher();

	const borderThickness: number = 3;

	const style: string = `position: absolute; left: ${transform.x + wallThickness / 2}px; top: ${
		transform.y
	}px;`;

	let open = false;
	const isDesktop = mediaQuery('(min-width: 768px)');
</script>

{#if $isDesktop}
	{#if !window.location.href.includes('admin/maps')}
		<AlertDialog.Root bind:open>
			<AlertDialog.Trigger>
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
							fill={bookedMorning || bookedAfternoon
								? bookedColor
								: assigned
								? assignedColor
								: freeColor}
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
			</AlertDialog.Trigger>
			<AlertDialog.Content class="z-[1000] !h-screen">
				<ModalBooking />
			</AlertDialog.Content>
		</AlertDialog.Root>
	{:else}
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
					fill={bookedMorning || bookedAfternoon
						? bookedColor
						: assigned
						? assignedColor
						: freeColor}
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
	{/if}
{:else}
	<Drawer.Root bind:open>
		<Drawer.Trigger>
			<button
				class="z-40"
				style={useAsMain ? style : ''}
				on:touchend={() => {
					dispatch('click');
					console.log('button gets pressed');
				}}
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
						fill={bookedMorning || bookedAfternoon
							? bookedColor
							: assigned
							? assignedColor
							: freeColor}
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
		</Drawer.Trigger>
		<Drawer.Content class="z-[1000] h-full !min-h-[90vh]">
			<ModalBooking />
		</Drawer.Content>
	</Drawer.Root>
{/if}
