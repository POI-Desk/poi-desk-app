<script lang="ts">
	import DateSelection from '$components/DateSelection.svelte';

	import { page } from '$app/stores';
	import BottomNav from '$components/BottomNav.svelte';
	import BuildingSelection from '$components/BuildingSelection.svelte';
	import FloorSelection from '$components/FloorSelection.svelte';
	import FloorMap from '$components/MapComponents/FloorMap.svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import { isExtended } from '$lib/stores/extendedUserStore';
	import { user } from '$lib/userStore';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import AdminBuildingSelector from '$components/MapComponents/AdminBuildingSelector.svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;
	$: ({ map } = data);
	$: ({ bookings } = data);

	$isExtended = false; // TODO idk if this is a good idea.. but it works

	$: floorName = data.query?.floor ?? '';
	$: buildingName = data.query?.building ?? '';
	$: date = data.query?.date ?? new Date().toISOString().split('T')[0];

	const changeBuilding = (name: string) => {
		const query = new URLSearchParams($page.url.searchParams);

		const floor =
			data.location?.buildings
				?.filter((b) => b.buildingname === name)
				.flatMap((b) => b.floors)
				.map((f) => f?.floorname)[0] ?? '';
		query.set('building', name);
		query.set('floor', floor);
		goto(`?${query.toString()}`);
	};

	const changeFloor = (name: string) => {
		const query = new URLSearchParams($page.url.searchParams);
		query.set('floor', name);
		goto(`/${data.location?.locationname}?${query.toString()}`);
	};

	onMount(() => {
		$user = data.session;
	});
</script>

<div class="overflow-hidden h-screen">
	<FloorMap
		mapData={$map?.data?.getPublishedMapByLocationBuildingFloorName}
		bookingsData={$bookings?.data?.getBookingsByDateInLocationAndBuildingNameFloorName}
	/>

	<div class="absolute p-8 w-full">
		<SearchBar />
		<div class="flex justify-center p-1">
			<DateSelection {date} />
		</div>
	</div>

	<div class="hidden md:block">
		<div
			class="absolute flex flex-col top-1/2 -translate-y-1/2 lg:right-11 right-2 w-52 border-2 border-primary-300 bg-surface-50 rounded-xl shadow-around-10"
		>
			<a
				href="/bookings"
				class="btn rounded-none rounded-t-[10px] w-full hover:bg-primary-500 hover:bg-opacity-[15%]"
				>Bookings</a
			>

			<a
				href={`/admin?building=${buildingName}&floor=${floorName}`}
				class="btn rounded-none w-full hover:bg-primary-500 hover:bg-opacity-[15%]">Map Creator</a
			>

			<a
				href="/admin/analysis"
				class="btn rounded-none w-full hover:bg-primary-500 hover:bg-opacity-[15%]">Analysis</a
			>

			<a href="/user" class="btn rounded-none w-full hover:bg-primary-500 hover:bg-opacity-[15%]"
				>User</a
			>

			<a
				href="/login"
				class="btn rounded-none rounded-b-[10px] border-surface-900 w-full hover:bg-primary-500 hover:bg-opacity-[15%]"
				>Change User</a
			>
		</div>
	</div>

	<div class="absolute bottom-0 w-screen md:hidden block">
		<BottomNav />
	</div>

	<FloorSelection
		bind:floorName
		floors={data.location?.buildings?.filter((b) => b.buildingname === buildingName).flatMap((b) => b.floors)}
		on:change={() => changeFloor(floorName)}
	/>

	<BuildingSelection
		bind:buildingName
		buildings={data.location?.buildings}
		on:change={() => changeBuilding(buildingName)}
	/>
</div>
