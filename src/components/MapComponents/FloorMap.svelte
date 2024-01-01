<script lang="ts">
	import { CachePolicy } from '$houdini';
	import { selectedDesk } from '$lib/bookingStore';
	import { dateValue } from '$lib/dateStore';
	import { floorid } from '$lib/floorStore';
	import { deskProps, doorProps, panzoomProps, wallProps, wallThickness } from '$lib/map/props';
	import { getBookingsByDate } from '$lib/queries/booking';
	import { getDeskById } from '$lib/queries/deskQueries';
	import { getMapByFloor } from '$lib/queries/map';
	import type { MapTransform } from '$lib/types/mapTypes';
	import { ProgressBar, getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import type { PanZoom } from 'panzoom';
	import panzoom from 'panzoom';
	import { onDestroy, onMount } from 'svelte';
	import DeskSvg from './MapObjects/DeskSVG.svelte';
	import DoorSvg from './MapObjects/DoorSVG.svelte';
	import RoomSvg from './MapObjects/RoomSVG.svelte';
	import WallSvg from './MapObjects/WallSVG.svelte';

	let container: HTMLDivElement;
	let grid: HTMLDivElement;
	let canvas: HTMLCanvasElement;

	let panz: PanZoom;
	let map: MapTransform = {
		height: 0,
		width: 0,
		scale: 1
	};

	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'component',
		component: 'modalBooking'
	};

	let deskObjects: { [key: string]: DeskSvg } = {};
	let roomObjects: { [key: string]: RoomSvg } = {};
	let doorObjects: { [key: string]: DoorSvg } = {};
	let wallObjects: { [key: string]: WallSvg } = {};

	$: mapData = $getMapByFloor.data?.getMapByFloor;

	$: bookingsData = $getBookingsByDate.data?.getBookingsByDate;

	$: {
		bookingsData;
		updateBookings();
	}

	$: {
		$floorid;
		updateMap();
	}

	onMount(() => {
		panz = panzoom(grid, {
			...panzoomProps
		});
		panz.on('zoom', (e: PanZoom) => {
			map.scale = e.getTransform().scale;
		});

		recenterMap();
	});

	onDestroy(() => {
		if (!panz) return;

		panz.dispose();
	});

	const updateMap = async () => {
		if (!$floorid) return;
		emptyMap();
		await getMapByFloor.fetch({
			variables: { floorID: $floorid },
			policy: CachePolicy.NetworkOnly
		});
		drawMap();
		await getBookingsByDate.fetch({
			variables: { date: $dateValue },
			policy: CachePolicy.NetworkOnly
		});
		await updateBookings();
	};

	const updateBookings = async () => {
		//TODO: make the booking fetch work here

		for (const key of Object.keys(deskObjects)) {
			const desk: DeskSvg = deskObjects[key];
			const bookings = bookingsData?.filter((b) => b?.desk.pk_deskid === key);
			let morning: boolean = false;
			let afternoon: boolean = false;
			bookings?.map((booking) => {
				if (booking) {
					if (booking.ismorning) morning = true;
					if (booking.isafternoon) afternoon = true;
				}
			});
			desk.setBookedAfternoon(afternoon);
			desk.setBookedMorning(morning);
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
		deskObjects = {};
		roomObjects = {};
		wallObjects = {};
		doorObjects = {};
	};

	const drawMap = () => {
		if (!mapData) return;
		map.height = mapData.height;
		map.width = mapData.width;
		panz.zoomAbs(0, 0, 1);

		mapData.desks?.map((desk) => {
			const deskSvg = new DeskSvg({
				target: grid,
				props: {
					text: desk.desknum,
					z: 40,
					useAsMain: true,
					transform: {
						x: desk.x,
						y: desk.y,
						rotation: 0
					}
				}
			});
			deskSvg.$on('click', async () => {
				$selectedDesk = (
					await getDeskById.fetch({
						variables: { deskId: desk.pk_deskid },
						policy: CachePolicy.NetworkOnly
					})
				).data?.getDeskById;
				modalStore.trigger(modal);
			});
			deskObjects[desk.pk_deskid] = deskSvg;
		});

		mapData.rooms?.map((room) => {
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

		mapData.doors?.map((door) => {
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

		mapData.walls?.map((wall) => {
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
		recenterMap();
	};
</script>

<div bind:this={container} class="absolute overflow-hidden w-screen h-screen">
	<div
		bind:this={grid}
		role="grid"
		tabindex="0"
		style="width: {map.width}px; height: {map.height}px;"
		class="z-0"
	>
		{#if $getMapByFloor.fetching}
			<div class="absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 w-1/6">
				<ProgressBar value={undefined} />
			</div>
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
{#if !$getMapByFloor.fetching && !mapData}
	<div class="absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2">
		<p class="text-2xl">No map found for this floor</p>
	</div>
{/if}
