<!-- TODO: MAKE ALL COMPONENTS IN THE MAP UNIFIED IN ONE LIST + POSSIBLY SEPERATE LISTS FOR API -->

<script lang="ts">
	import SaveMapModal from '$components/MapComponents/SaveMapModal.svelte';
	import Desk from '$components/MapComponents/DeskComponent.svelte';
	import { addDesksToFloor as addDesksToFloor } from '$lib/mutations/desks';
	import { onDestroy, onMount } from 'svelte';
	import panzoom, { type PanZoom } from 'panzoom';
	import { allDesks, selectedDesk } from '$lib/map/creator/deskStore';
	import { defaultMapScale, deskProps, panzoomProps } from '$lib/map/props';
	import WallComponent from '$components/MapComponents/RoomComponent.svelte';

	let grid: HTMLElement;
	let main: HTMLElement;
	let container: HTMLElement;

	let canvas: HTMLCanvasElement;
	let panz: PanZoom;
	let scale: number = 1;

	let openModal: boolean = false;

	let defaultDesknum: string = '1';

	let desks: { [key: string]: Desk } = {};

	onMount(() => {
		panz = panzoom(grid, panzoomProps);

		panz.on('zoom', (e: PanZoom) => {
			scale = e.getTransform().scale;
			Object.keys(desks).forEach((key) => {
				let desk = desks[key];
				desk.$set({
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
			removeDesk();
		}
	};

	const handleMouseDown = (event: MouseEvent) => {
		if (event.target === canvas && $selectedDesk.element) {
			resetSelectedDeskStyle();
			$selectedDesk = {
				element: null,
				desk: null
			};
		}
	};

	const removeDesk = () => {
		if (!$selectedDesk.element || !$selectedDesk.desk) {
			return;
		}
		delSelectedDesk();
	};

	const createDesk = (event: MouseEvent) => {
		scale = panz.getTransform().scale;
		resetSelectedDeskStyle();
		const element = new Desk({
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
				desknum: defaultDesknum
			}
		});

		element.$on('selectDesk', (event: CustomEvent<{ drag: HTMLElement; desknum: string }>) => {
			panz.pause();
			if ($selectedDesk.element === event.detail.drag) return;
			resetSelectedDeskStyle();
			$selectedDesk = {
				element: event.detail.drag,
				desk: $allDesks.find((desk) => desk.desk!.desknum === event.detail.desknum)!.desk
			};
		});

		element.$on(
			'releaseDesk',
			(event: CustomEvent<{ left: number; top: number; enabled: boolean }>) => {
				panz.resume();
				if (!event.detail.enabled) {
					delSelectedDesk();
					return;
				}
				let left: number = event.detail.left;
				let top: number = event.detail.top;
				resizeGrid(left, top);
				normalizeGridSize();
			}
		);
		panz.pause();
		$allDesks.push($selectedDesk);
		desks[defaultDesknum] = element;
		defaultDesknum += '1';
	};

	//x and y are in local space of the parent element
	const resizeGrid = (x: number, y: number) => {
		const grid_width: number = +grid.style.width.slice(0, -2);
		const grid_height: number = +grid.style.height.slice(0, -2);

		let panzOffsetX: number = 0;
		let panzOffsetY: number = 0;

		const deskW = deskProps.width * 0.5;
		const deskH = deskProps.height * 0.5;

		if (x < 0 + defaultMapScale.border + deskW) {
			grid.style.width =
				grid_width + (x > 0 ? deskW - x : Math.abs(x) + deskW) + defaultMapScale.border + 'px';
			panzOffsetX = x - (deskW + defaultMapScale.border);
		} else if (x > grid_width - (defaultMapScale.border + deskW)) {
			grid.style.width = grid_width + (x - grid_width) + deskW + defaultMapScale.border + 'px';
		}
		if (y < 0 + defaultMapScale.border + deskH) {
			grid.style.height =
				grid_height + (y > 0 ? deskH - y : Math.abs(y) + deskH) + defaultMapScale.border + 'px';
			panzOffsetY = y - (deskH + defaultMapScale.border);
		} else if (y > grid_height - (defaultMapScale.border + deskH)) {
			grid.style.height = grid_height + (y - grid_height) + deskH + defaultMapScale.border + 'px';
		}

		if (panzOffsetX !== 0 || panzOffsetY !== 0) {
			$allDesks.forEach((desk) => {
				const style: CSSStyleDeclaration = desk.element?.style!;
				let l: number = +style.left.slice(0, -2) - panzOffsetX;
				let t: number = +style.top.slice(0, -2) - panzOffsetY;

				style.left = l + 'px';
				style.top = t + 'px';
				if (desk.desk?.desknum! === $selectedDesk.desk?.desknum!) {
					$selectedDesk.desk!.x = l;
					$selectedDesk.desk!.y = t;
				}
				desks[desk.desk?.desknum!].setCoords(+style.left.slice(0, -2), +style.top.slice(0, -2));
			});
		}

		canvas.width = +grid.style.width.slice(0, -2);
		canvas.height = +grid.style.height.slice(0, -2);
		panz.moveTo(
			panz.getTransform().x + panzOffsetX * scale,
			panz.getTransform().y + panzOffsetY * scale
		);
	};

	const normalizeGridSize = () => {
		if ($allDesks.length === 0) {
			grid.style.width = defaultMapScale.width + 'px';
			grid.style.height = defaultMapScale.height + 'px';
			canvas.width = defaultMapScale.width;
			canvas.height = defaultMapScale.height;
			return;
		}
		const grid_width: number = +grid.style.width.slice(0, -2);
		const grid_height: number = +grid.style.height.slice(0, -2);

		let left: number = Number.MAX_SAFE_INTEGER;
		let right: number = Number.MIN_SAFE_INTEGER;
		let top: number = Number.MAX_SAFE_INTEGER;
		let bottom: number = Number.MIN_SAFE_INTEGER;
		$allDesks.forEach((desk) => {
			if (desk.desk?.x! < left) left = desk.desk?.x!;
			if (desk.desk?.y! < top) top = desk.desk?.y!;
		});

		let horizontalOffset: number = 0;
		let verticalOffset: number = 0;

		let mapWidth: number = defaultMapScale.width;
		let mapHeight: number = defaultMapScale.height;

		if (
			left > defaultMapScale.maxHorizontalDist ||
			(left > defaultMapScale.border + deskProps.width * 0.5 &&
				left < defaultMapScale.border + deskProps.width + (grid_width - defaultMapScale.width))
		) {
			horizontalOffset = -left + deskProps.width * 0.5 + defaultMapScale.border;
		}
		if (
			top > defaultMapScale.maxVerticalDist ||
			(left > defaultMapScale.border + deskProps.height * 0.5 &&
				left < defaultMapScale.border + deskProps.height + (grid_height - defaultMapScale.width))
		) {
			verticalOffset = -top + deskProps.height * 0.5 + defaultMapScale.border;
		}

		$allDesks.forEach((desk) => {
			const deskStyle: CSSStyleDeclaration = desk.element?.style!;
			desk.desk!.x = +deskStyle.left.slice(0, -2) + horizontalOffset;
			desk.desk!.y = +deskStyle.top.slice(0, -2) + verticalOffset;
			deskStyle.left = desk.desk?.x + 'px';
			deskStyle.top = desk.desk?.y + 'px';
			desks[desk.desk?.desknum!].setCoords(desk.desk?.x!, desk.desk?.y!);
			if (desk.desk?.y! > bottom) bottom = desk.desk?.y!;
			if (desk.desk?.x! > right) right = desk.desk?.x!;
		});

		if (right > defaultMapScale.width - (defaultMapScale.border + deskProps.width * 0.5)) {
			mapWidth = right + deskProps.width * 0.5 + defaultMapScale.border;
		}
		if (bottom > defaultMapScale.height - (defaultMapScale.border + deskProps.height * 0.5)) {
			mapHeight = bottom + deskProps.height * 0.5 + defaultMapScale.border;
		}

		panz.moveTo(
			panz.getTransform().x - horizontalOffset * scale,
			panz.getTransform().y - verticalOffset * scale
		);

		grid.style.width = mapWidth + 'px';
		grid.style.height = mapHeight + 'px';
		canvas.width = mapWidth;
		canvas.height = mapHeight;
	};

	const delSelectedDesk = () => {
		$allDesks = $allDesks.filter((desk) => desk.desk!.desknum !== $selectedDesk.desk?.desknum);
		desks[$selectedDesk.desk!.desknum].$destroy();
		delete desks[$selectedDesk.desk!.desknum];
		$selectedDesk = {
			element: null,
			desk: null
		};
		normalizeGridSize();
	};

	const resetSelectedDeskStyle = () => {
		if (!$selectedDesk.element) return;
		$selectedDesk.element.style.removeProperty('border');
	};

	const toggleModal = () => {
		openModal = !openModal;
	};

	const saveMap = () => {
		addDesksToFloor.mutate({
			floorid: '3af4f424-a92b- -bfdb-55bd768218be',
			desks: $allDesks.map((s) => s.desk!)
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
		<button on:mousedown={createDesk} class="btn variant-filled-primary">Desk</button>
		<button on:click={toggleModal} class="btn variant-filled-primary">Save</button>
	</div>
	<div bind:this={container} class="overflow-auto w-screen">
		<div
			bind:this={grid}
			on:mouseenter={enterGrid}
			on:mouseleave={leaveGrid}
			role="grid"
			tabindex="0"
			style="width: {defaultMapScale.width}px; height: {defaultMapScale.height}px;"
			class="z-0"
		>
			<canvas
				bind:this={canvas}
				width={defaultMapScale.width}
				height={defaultMapScale.height}
				draggable="false"
				class="bg-slate-500"
			/>
		</div>
	</div>
</main>

<style>
	@import 'tailwindcss/base';
	@import 'tailwindcss/components';
	@import 'tailwindcss/utilities';
</style>
