<script lang="ts">
	import SaveMapModal from '$components/MapComponents/SaveMapModal.svelte';
	import { pan } from 'svelte-gestures';
	import Table from '$components/MapComponents/Table.svelte';
	import type { Seatinput } from '$houdini';
	import { addSeatsToFloor } from '$lib/mutations/seats';
	import { onDestroy, onMount } from 'svelte';
	import panzoom, { type PanZoom } from 'panzoom';
	import type { Subscriber } from 'svelte/motion';
	import type { DragEventHandler } from 'svelte/elements';

	let grid: HTMLElement;
	let panz: PanZoom;
	let mouseX: number = 0;
	let mouseY: number = 0;

	let openModal: boolean = false;
	let row: number[] = Array.from({ length: 35 }, (_, index) => index);
	let column: number[] = Array.from({ length: 20 }, (_, index) => index);

	let defaultSeatnum: string = "1";

	let tables: Table[] = [];
	let seats: Seatinput[] = [];
	let selectedSeat: {
		elemet: HTMLElement | null,
		seat: Seatinput | null,
	} = {
		elemet: null,
		seat: null,
	};

	onMount(() => {
		panz = panzoom(
			grid,
			{
				smoothScroll: false,
				maxZoom: 5,
				minZoom: 0.5,
				transformOrigin: { x: mouseX, y: mouseY },
			}
		);
		panz.on('zoom', (e: PanZoom) => {
			tables.forEach((table) => {
				table.$set({
					scale: e.getTransform().scale,
				});
			});
		});
		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('mousedown', handleMouseDown);
	});

	onDestroy(() => {
		if (!panz || !window)
			return;

		panz.dispose();
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('mousedown', handleMouseDown);
	});



	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Delete') {
			removeTable();
		}
	}

	const handleMouseDown = (event: MouseEvent) => {
		if (event.target !== selectedSeat.elemet && selectedSeat.elemet) {
			selectedSeat.elemet.style.removeProperty('border');
			selectedSeat = {
				elemet: null,
				seat: null,
			};
		}
	}

	const removeTable = () => {
		if (!selectedSeat.elemet || !selectedSeat.seat) {
			return;
		}
		selectedSeat.elemet.remove();
		seats = seats.filter((table) => table.seatnum !== selectedSeat.seat?.seatnum);
		selectedSeat = {
			elemet: null,
			seat: null,
		};
			
	}

	const createTable = (event: MouseEvent) =>{
		const element = new Table({
			target: grid,
			props: {
				initX: (event.clientX - grid.getBoundingClientRect().left),
				initY: (event.clientY - grid.getBoundingClientRect().top),
				scale: panz.getTransform().scale,
				initMouseX: event.clientX,
				initMouseY: event.clientY,
				initDrag: true,
				drag: null,
				seatnum: defaultSeatnum,
			},
		});

		element.$on('selectTable', (event: CustomEvent<{drag: HTMLElement, seatnum: string}>) => {
			panz.pause();
			if (selectedSeat.elemet) {
				selectedSeat.elemet.style.removeProperty('border');
			}
			selectedSeat.elemet = event.detail.drag;
			selectedSeat.seat = seats.find((seat) => seat.seatnum === event.detail.seatnum)!;
			if (selectedSeat.elemet)
				selectedSeat.elemet.style.border = '2px solid red';
		});

		element.$on('updatePosition', (event: CustomEvent<number[]>) => {
			panz.resume();
			const [x, y] = event.detail;
			if (!selectedSeat)
				return;
			selectedSeat.seat!.x = x;
			selectedSeat.seat!.y = y;
		});
		
		selectedSeat.seat = {
			seatnum: defaultSeatnum,
			x: event.clientX - grid.getBoundingClientRect().left,
			y: event.clientY - grid.getBoundingClientRect().top,
		};
		seats.push(selectedSeat.seat);
		tables.push(element);
		defaultSeatnum += "1";
	}

	const toggleModal = () => {
		openModal = !openModal;
	}

	const savePlan = () => {
		addSeatsToFloor.mutate({floorid: "3af4f424-a92b- -bfdb-55bd768218be", seats: seats});
	}

	const enterGrid = (event: MouseEvent) => {
		panz.resume();
	}

	const leaveGrid = () => {
		panz.pause();
	}

</script>

<main class="overflow-hidden h-screen">
	<SaveMapModal openModal={openModal} on:closeModal={toggleModal}/>
	<button on:mousedown={createTable} class="btn btn-primary">Table</button>
	<button on:click={toggleModal} class="btn btn-primary">Save</button>
	<div
		bind:this={grid}
		on:mouseenter={enterGrid}
		on:mouseleave={leaveGrid}
		role="grid"
		tabindex="0"
		draggable="false"
		class="overflow-hidde"
		style=" left: 50%; top: 50%; position: absolute; transform: translate(-50%, -50%);"
	>
		{#each row as y (y)}
			<div id={y.toString()} class="flex" draggable="false">
				{#each column as x (x)}
					<div
						draggable="false"
						id={y.toString() + x.toString()}
						class={(x + y) % 2 === 0 ? 'bg-gray-600' : 'bg-gray-500'}
						style="height: 25px; width: 25px;"
					/>
				{/each}
			</div>
		{/each}
		</div>
</main>

<style>
	@import 'tailwindcss/base';
	@import 'tailwindcss/components';
	@import 'tailwindcss/utilities';
</style>
