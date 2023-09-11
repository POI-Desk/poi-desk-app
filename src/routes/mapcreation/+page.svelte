<script lang="ts">
	import SaveMapModal from '$components/MapComponents/SaveMapModal.svelte';
	import Table from '$components/MapComponents/Table.svelte';
	import { addSeatsToFloor } from '$lib/mutations/seats';
	import { onDestroy, onMount } from 'svelte';
	import panzoom, { type PanZoom } from 'panzoom';
	import { allSeats, deskProps, selectedSeat } from '$lib/seatStore';
	import { closestNumber } from '$lib/helper';

	let grid: HTMLElement;
	let main: HTMLElement;
	let container: HTMLElement;

	let canvas: HTMLCanvasElement;
	let panz: PanZoom;
	let scale: number = 1;

	let openModal: boolean = false;

	let defaultSeatnum: string = '1';

	let tables: { [key: string]: Table } = {};

	onMount(() => {
		panz = panzoom(grid, {
			smoothScroll: false,
			maxZoom: 3,
			minZoom: 0.5,
			initialZoom: 1,
			autocenter: true
		});

		panz.on('zoom', (e: PanZoom) => {
			scale = e.getTransform().scale;
			Object.keys(tables).forEach((key) => {
				let table = tables[key];
				table.$set({
					scale: scale
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
		scale = panz.getTransform().scale;
		resetSelectedSeatStyle();
		const element = new Table({
			target: main,
			props: {
				enabled: false,
				target: grid,
				main: main,
				drawer: container,
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
				seat: $allSeats.find((seat) => seat.seat!.seatnum === event.detail.seatnum)!.seat
			};
		});

		element.$on(
			'releaseTable',
			(event: CustomEvent<{ left: number; top: number; enabled: boolean }>) => {
				panz.resume();
				if (!event.detail.enabled) {
					delSelectedSeat();
					return;
				}
				let left: number = event.detail.left;
				let top: number = event.detail.top;
				resizeGrid(left, top);
			}
		);
		panz.pause();
		$allSeats.push($selectedSeat);
		tables[defaultSeatnum] = element;
		defaultSeatnum += '1';
	};

	//left and top are in local space of the parent element
	const resizeGrid = (left: number, top: number) => {
		let grid_width: number = +grid.style.width.slice(0, -2);
		let grid_height: number = +grid.style.height.slice(0, -2);
		let grid_top: number = +grid.style.top.slice(0, -2);
		let grid_left: number = +grid.style.left.slice(0, -2);

		let panzOffsetX: number = 0;
		let panzOffsetY: number = 0;

		if (left < 0) {
			grid.style.width = grid_width + Math.abs(left) + deskProps.width * 0.5 + 'px';
			panzOffsetX = left - deskProps.width * 0.5;
		} else if (left > grid_width) {
			grid.style.width = grid_width + (left - grid_width) + deskProps.width * 0.5 + 'px';
		}
		if (top < 0) {
			grid.style.height = grid_height + Math.abs(top) + deskProps.height * 0.5 + 'px';
			panzOffsetY = top - deskProps.height * 0.5;
		} else if (top > grid_height) {
			grid.style.height = grid_height + (top - grid_height) + deskProps.height * 0.5 + 'px';
		}

		if (panzOffsetX !== 0 || panzOffsetY !== 0) {
			$allSeats.forEach((desk) => {
				const style: CSSStyleDeclaration = desk.element?.style!;
				style.left = +style.left.slice(0, -2) - panzOffsetX + 'px';
				style.top = +style.top.slice(0, -2) - panzOffsetY + 'px';
				tables[desk.seat?.seatnum!].setCoords(+style.left.slice(0, -2), +style.top.slice(0, -2));
			});
		}

		canvas.width = +grid.style.width.slice(0, -2);
		canvas.height = +grid.style.height.slice(0, -2);
		panz.moveTo(
			panz.getTransform().x + panzOffsetX * scale,
			panz.getTransform().y + panzOffsetY * scale
		);
	};

	const delSelectedSeat = () => {
		$allSeats = $allSeats.filter((table) => table.seat!.seatnum !== $selectedSeat.seat?.seatnum);
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
		addSeatsToFloor.mutate({
			floorid: '3af4f424-a92b- -bfdb-55bd768218be',
			seats: $allSeats.map((s) => s.seat)
		});
	};

	const enterGrid = (event: MouseEvent) => {
		panz.resume();
	};

	const leaveGrid = (event: MouseEvent) => {
		panz.pause();
	};
</script>

<main bind:this={main} class="overflow-hidden flex flex-row h-screen">
	<SaveMapModal {openModal} on:closeModal={toggleModal} />
	<div class="w-2/12 h-screen bg-gray-600 shadow-xl shadow-black z-10">
		<button on:mousedown={createTable} class="btn btn-primary">Table</button>
		<button on:click={toggleModal} class="btn btn-primary">Save</button>
	</div>
	<div bind:this={container} class="border overflow-auto w-screen">
		<div
			bind:this={grid}
			on:mouseenter={enterGrid}
			on:mouseleave={leaveGrid}
			role="grid"
			tabindex="0"
			style="width: 750px; height: 1000px;"
			class="z-0 border"
		>
			<canvas bind:this={canvas} width="750" height="1000" draggable="false" class="bg-slate-500" />
		</div>
	</div>
</main>

<style>
	@import 'tailwindcss/base';
	@import 'tailwindcss/components';
	@import 'tailwindcss/utilities';
</style>
