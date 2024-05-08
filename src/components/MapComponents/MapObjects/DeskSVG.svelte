<script lang="ts">
	import ModalEditDesk from '$components/MapComponents/ModalEditDesk.svelte';
	import { deskProps, wallThickness } from '$lib/map/props';
	import { createEventDispatcher } from 'svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import * as Drawer from '$lib/components/ui/drawer';
	import ModalBooking from '$components/SetBookingComponents/ModalContents/ModalBooking.svelte';
	import { mediaQuery } from 'svelte-legos';
	import { Pen } from 'lucide-svelte';
	import * as ContextMenu from '$lib/components/ui/context-menu';
	import { Button } from '$lib/components/ui/button';
	import AlertDialogCancel from '$lib/components/ui/alert-dialog/alert-dialog-cancel.svelte';

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
	let selectedUserId: string = '';

	function handleMessage(event: any) {
		selectedUserId = event.detail.userId;
	}

	function saveModal() {
		dispatch('save', { userId: selectedUserId });
	}
</script>

{#if $isDesktop}
	{#if !window.location.href.includes('admin/maps')}
		<AlertDialog.Root bind:open closeOnOutsideClick={true}>
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
				<ModalBooking>
					<AlertDialog.Action class="w-full h-full">
						<Button class="btn w-full h-full text-xl ">Book</Button>
					</AlertDialog.Action>
				</ModalBooking>
			</AlertDialog.Content>
		</AlertDialog.Root>
	{:else}
		<button
			class="z-{z} flex flex-row"
			style={useAsMain ? style : ''}
			on:touchend={() => dispatch('click')}
			on:click={() => dispatch('click')}
		>
			<ContextMenu.Root>
				<AlertDialog.Root>
					<ContextMenu.Trigger>
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
					</ContextMenu.Trigger>
					<ContextMenu.Content>
						<AlertDialog.Trigger class="w-full">
							<ContextMenu.Item>Edit</ContextMenu.Item>
						</AlertDialog.Trigger>
						<ContextMenu.Item>Delete</ContextMenu.Item>
					</ContextMenu.Content>
					<AlertDialog.Content>
						<ModalEditDesk on:selectedUserChange={handleMessage}>
							<div class="flex flex-row space-x-2 justify-end w-full">
								<AlertDialog.Cancel asChild let:builder>
									<Button builders={[builder]} class="btn border-2 border-primary-500 w-20">
										Cancel
									</Button>
								</AlertDialog.Cancel>
								<AlertDialog.Action asChild let:builder>
									<Button
										builders={[builder]}
										class="btn bg-primary-500 w-20"
										on:click={() => {
											saveModal();
										}}
									>
										Save
									</Button>
								</AlertDialog.Action>
							</div>
						</ModalEditDesk>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</ContextMenu.Root>
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
