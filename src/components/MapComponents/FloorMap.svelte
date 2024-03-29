<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { CachePolicy } from '$houdini';
	import { interval } from '$lib/bookingStore';
	import { doorProps, panzoomProps, wallProps, wallThickness } from '$lib/map/props';
	import type { MapTransform } from '$lib/types/mapTypes';
	import type { PanZoom } from 'panzoom';
	import panzoom from 'panzoom';
	import { onDestroy, onMount } from 'svelte';
	import DeskSvg from './MapObjects/DeskSVG.svelte';
	import DoorSvg from './MapObjects/DoorSVG.svelte';
	import RoomSvg from './MapObjects/RoomSVG.svelte';
	import WallSvg from './MapObjects/WallSVG.svelte';
	import { isExtended, selectedDesks, selectedUsers } from '$lib/stores/extendedUserStore';
	import Label from './MapObjects/Label.svelte';
	import type { Desk } from '$lib/types/deskTypes';
	import { getDeskById } from '$lib/queries/deskQueries';
	import { toast } from 'svelte-sonner';
	import { compareObjectsByValues } from '$lib/map/helper';

	let container: HTMLDivElement;
	let grid: HTMLDivElement;
	let canvas: HTMLCanvasElement;

	let drawingMap: boolean = false;
	let finRender: boolean = false;

	let panz: PanZoom;
	let map: MapTransform = {
		height: 0,
		width: 0,
		scale: 1
	};

	let deskObjects: { [key: string]: DeskSvg } = {};
	let roomObjects: { [key: string]: RoomSvg } = {};
	let doorObjects: { [key: string]: DoorSvg } = {};
	let wallObjects: { [key: string]: WallSvg } = {};
	let labelObjects: { [key: string]: Label } = {};

	export let mapData: any;

	export let bookingsData: any;

	let query: URLSearchParams = new URLSearchParams('');
	let oldMapData: any = null;

	$: {
		const q = new URLSearchParams($page.url.searchParams);
		const m = mapData;
		if (!compareObjectsByValues(m, oldMapData)) {
			oldMapData = m;
			drawMap();
		} else if (q.get('date') !== query.get('date')) {
			updateBookings();
		}
	}

	onMount(() => {
		panz = panzoom(grid, {
			...panzoomProps
		});
		panz.on('zoom', (e: PanZoom) => {
			map.scale = e.getTransform().scale;
		});

		recenterMap();

		finRender = true;
		drawMap();
	});

	onDestroy(() => {
		emptyMap();
		if (!panz) return;
		panz.dispose();
	});

	const emptyMap = () => {
		for (const [key, value] of Object.entries(deskObjects)) {
			value.$destroy();
		}
		for (const [key, value] of Object.entries(roomObjects)) {
			value.$destroy();
		}
		for (const [key, value] of Object.entries(wallObjects)) {
			value.$destroy();
		}
		for (const [key, value] of Object.entries(doorObjects)) {
			value.$destroy();
		}
		for (const [key, value] of Object.entries(labelObjects)) {
			value.$destroy();
		}

		deskObjects = {};
		roomObjects = {};
		wallObjects = {};
		doorObjects = {};
		labelObjects = {};
	};

	const updateBookings = () => {
		if (!finRender) return;

		for (const key of Object.keys(deskObjects)) {
			const desk: DeskSvg = deskObjects[key];
			const bookings = bookingsData?.filter((b: any) => b?.desk.pk_deskid === key);
			let morning: boolean = false;
			let afternoon: boolean = false;
			bookings?.map((booking: any) => {
				if (booking) {
					if (booking.ismorning) morning = true;
					if (booking.isafternoon) afternoon = true;
				}
			});
			desk.setBookedAfternoon(afternoon);
			desk.setBookedMorning(morning);
			desk.setSelected(false);
		}
	};

	const recenterMap = (smooth: boolean = false, offsetX: number = 0, offsetY: number = 0) => {
		if (!smooth) {
			panz.moveTo(
				window.innerWidth / 2 - (map.width / 2 + offsetX) / map.scale,
				window.innerHeight / 2 - (map.height / 2 + offsetY) / map.scale
			);
		} else
			panz.smoothMoveTo(
				window.innerWidth / 2 - (map.width / 2 + offsetX) * map.scale,
				window.innerHeight / 2 - (map.height / 2 + offsetY) * map.scale
			);
	};

	const drawMap = () => {
		emptyMap();
		if (!mapData || !browser || !finRender) return;

		drawingMap = true;
		map.height = mapData.height;
		map.width = mapData.width;
		panz.zoomAbs(0, 0, 1);

		mapData.desks?.map((desk: any) => {
			const deskSvg = new DeskSvg({
				target: grid,
				props: {
					text: desk.desknum,
					z: 40,
					useAsMain: true,
					assigned: desk.user !== null,
					transform: {
						x: desk.x,
						y: desk.y,
						rotation: 0
					}
				}
			});
			deskSvg.$on('click', async () => {
				console.log('dispatched lol');
				console.log('isExtended', $isExtended);
				if ($isExtended) {
					let newD: Desk = {
						pk_deskid: desk.pk_deskid,
						desknum: desk.desknum,
						bookings: desk.bookings!,
						floor: mapData?.floor!
					};
					if ($selectedDesks.includes(newD)) {
						$selectedDesks.splice($selectedDesks.indexOf(newD), 1);
						deskSvg.setSelected(false);
					} else if ($selectedDesks.length >= $selectedUsers.length) {
						toast.error('Too many desks selected!', {
							position: 'bottom-center'
						});
					} else {
						if (
							($interval.morning && !deskSvg.getBookedMorning()) ||
							($interval.afternoon && !deskSvg.getBookedAfternoon())
						) {
							$selectedDesks.push(newD);
							deskSvg.setSelected(true);
						}
					}

					$selectedDesks = $selectedDesks;
				} else {
					const i = await getDeskById.fetch({
						variables: { deskId: desk.pk_deskid },
						policy: CachePolicy.NetworkOnly
					});
					//modalStore.trigger(modal);
				}
			});
			deskObjects[desk.pk_deskid] = deskSvg;
		});

		mapData.rooms?.map((room: any) => {
			const roomSvg = new RoomSvg({
				target: grid,
				props: {
					height: room.height + wallThickness,
					width: room.width + wallThickness,
					z: 10,
					useAsMain: true,
					transform: {
						x: room.x,
						y: room.y,
						rotation: 0
					}
				}
			});
			roomObjects[room.pk_roomId] = roomSvg;
		});

		mapData.doors?.map((door: any) => {
			const doorSvg = new DoorSvg({
				target: grid,
				props: {
					height: doorProps.height,
					width: door.width + wallThickness,
					z: 30,
					useAsMain: true,
					transform: {
						x: door.x,
						//WHY?
						y: door.y - doorProps.height / 2,
						rotation: 0
					}
				}
			});
			doorObjects[door.pk_doorId] = doorSvg;
		});

		mapData.walls?.map((wall: any) => {
			const wallSvg = new WallSvg({
				target: grid,
				props: {
					height: wallProps.height,
					width: wall.width + wallThickness,
					z: 20,
					useAsMain: true,
					transform: {
						x: wall.x,
						//WHY?
						y: wall.y - wallProps.height / 2,
						rotation: 0
					}
				}
			});
			wallObjects[wall.pk_wallId] = wallSvg;
		});

		mapData.labels?.map((label: any) => {
			const labelSvg = new Label({
				target: grid,
				props: {
					text: label.text,
					z: 60,
					transform: {
						x: label.x,
						y: label.y,
						width: label.width,
						height: label.height,
						rotation: 0
					}
				}
			});
			labelObjects[label.pk_labelId] = labelSvg;
		});

		recenterMap();
		updateBookings();
		drawingMap = false;
	};
</script>

<div bind:this={container} class="absolute overflow-hidden w-screen h-screen">
	<div bind:this={grid} role="grid" tabindex="0" class="z-0 w-[{map.width}px] h--[{map.height}px]">
		{#if drawingMap}
			<p>Drawing Map</p>
		{:else if mapData}
			<canvas
				bind:this={canvas}
				width={map.width}
				height={map.height}
				draggable="false"
				class="canvasStyle"
			/>
		{/if}
	</div>
</div>
{#if !mapData}
	<div class="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
		<p class="text-2xl text-center">No map found for this floor</p>
	</div>
{/if}
