<script lang="ts">
	import SaveMapModal from '$components/MapComponents/SaveMapModal.svelte';
	import Table from '$components/MapComponents/Table.svelte';
	import { addSeatsToFloor } from '$lib/mutations/seats';
	import { onDestroy, onMount } from 'svelte';
	import panzoom, { type PanZoom } from 'panzoom';
	import { allSeats, selectedSeat } from '$lib/seatStore';

	let grid: HTMLElement;
	let main: HTMLElement;
	let drawer: HTMLElement;

	let canvas: HTMLCanvasElement;
	let panz: PanZoom;

	let openModal: boolean = false;

	let defaultSeatnum: string = '1';

	let tables: { [key: string]: Table} = {};

	onMount(() => {
		panz = panzoom(grid, {
			smoothScroll: false,
			maxZoom: 3,
			minZoom: 0.5,
			initialZoom: 1,
			autocenter: true
		});

		panz.on('zoom', (e: PanZoom) => {
			Object.keys(tables).forEach((key) => {
				let table = tables[key];
				table.$set({
					scale: e.getTransform().scale
				});
			});
		});

		window.addEventListener('keydown', handleKeyDown);
		window.addEventListener('mousedown', handleMouseDown);
	});

	onDestroy(() => {
		if (!panz || !window) return;

		panz.dispose();
		window.removeEventListener('keydown', handleKeyDown);
		window.removeEventListener('mousedown', handleMouseDown);
	});

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === 'Delete') {
			removeTable();
		}
	};

	const handleMouseDown = (event: MouseEvent) => {
		if (event.target === canvas && $selectedSeat.element) {
			resetSelectedSeatStyle();
			$selectedSeat = {
				element: null,
				seat: null
			};
		}
	};

	const removeTable = () => {
		if (!$selectedSeat.element || !$selectedSeat.seat) {
			return;
		}
		delSelectedSeat();
	};

	const createTable = (event: MouseEvent) => {
		let scale: number = panz.getTransform().scale;
		resetSelectedSeatStyle();
		const element = new Table({
			target: main,
			props: {
				enabled: false,
				target: grid,
				main: main,
				drawer: drawer,
				initX: event.clientX - main.getBoundingClientRect().left,
				initY: event.clientY - main.getBoundingClientRect().top,
				scale: scale,
				initMouseX: event.clientX,
				initMouseY: event.clientY,
				initDrag: true,
				seatnum: defaultSeatnum
			}
		});

		element.$on('selectTable', (event: CustomEvent<{ drag: HTMLElement; seatnum: string }>) => {
			panz.pause();
			if ($selectedSeat.element === event.detail.drag) return;
			resetSelectedSeatStyle();
			$selectedSeat = {
				element: event.detail.drag,
				seat: $allSeats.find((seat) => seat.seatnum === event.detail.seatnum)!
			};
		});

		element.$on(
			'releaseTable',
			(event: CustomEvent<{ x: number; y: number; enabled: boolean }>) => {
				panz.resume();
				if (!event.detail.enabled) {
					delSelectedSeat();
					return;
				}
			}
		);
		panz.pause();
		$allSeats.push($selectedSeat.seat!);
		tables[defaultSeatnum] = element;
		defaultSeatnum += '1';
	};

	const delSelectedSeat = () => {
		$allSeats = $allSeats.filter((table) => table.seatnum !== $selectedSeat.seat?.seatnum);
		tables[$selectedSeat.seat!.seatnum].$destroy();
		delete tables[$selectedSeat.seat!.seatnum];
		$selectedSeat = {
			element: null,
			seat: null
		};
	};

	const resetSelectedSeatStyle = () => {
		if (!$selectedSeat.element) return;
		$selectedSeat.element.style.removeProperty('border');
	};

	const toggleModal = () => {
		openModal = !openModal;
	};

	const saveMap = () => {
		addSeatsToFloor.mutate({ floorid: '3af4f424-a92b- -bfdb-55bd768218be', seats: $allSeats });
	};

	const enterGrid = (event: MouseEvent) => {
		panz.resume();
	};

	const leaveGrid = (event: MouseEvent) => {
		panz.pause();
	};
</script>

<main bind:this={main} class="overflow-hidden h-screen">
	<SaveMapModal {openModal} on:closeModal={toggleModal} />
	<div bind:this={drawer} class="absolute w-1/4 h-screen bg-gray-600 shadow-xl shadow-black z-10">
		<button on:mousedown={createTable} class="btn btn-primary">Table</button>
		<button on:click={toggleModal} class="btn btn-primary">Save</button>
	</div>
	<div
		bind:this={grid}
		on:mouseenter={enterGrid}
		on:mouseleave={leaveGrid}
		role="grid"
		tabindex="0"
		style="width: 750px; height: 1000px;"
		class="z-0"
	>
		<canvas bind:this={canvas} width="750" height="1000" draggable="false" class="bg-slate-500" />
	</div>
</main>

<style>
	@import 'tailwindcss/base';
	@import 'tailwindcss/components';
	@import 'tailwindcss/utilities';
</style>
