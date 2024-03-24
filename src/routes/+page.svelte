<script lang="ts">
	import DateSelection from '$components/DateSelection.svelte';

	import BuildingSelection from '$components/BuildingSelection.svelte';
	import FloorSelection from '$components/FloorSelection.svelte';
	import FloorMap from '$components/MapComponents/FloorMap.svelte';
	import { onMount } from 'svelte';
	import { authId, user } from '$lib/userStore';
	import { isExtended } from '$lib/stores/extendedUserStore';
	import SearchBar from '$components/SearchBar.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	//
	// let visible = false;
	// let panelVisible = false;
	//
	// function togglePanel() {
	// 	panelVisible = !panelVisible;
	// }
	//
	// function hidePanel() {
	// 	panelVisible = false;
	// }
	//
	// function spinnnnn() {
	// 	visible = true;
	// 	setTimeout(() => {
	// 		visible = false;
	// 	}, 5000);
	// }
	$isExtended = false; // TODO idk if this is a good idea.. but it works
	let floorName: string;
	let buildingName: string;

	onMount(() => {
		$user = data.session;
	});
</script>

<!--{#if visible}-->
<!--	<CrazyAnimation>-->
<!--		<Check />-->
<!--	</CrazyAnimation>-->
<!--{/if}-->

<div class="overflow-hidden h-screen">

	
	<FloorMap />

	<div class="absolute p-8 w-full">
		<SearchBar />
		<div class="flex justify-center p-1">
			<DateSelection />
		</div>

		<!-- <div>
      <a class="btn variant-filled-primary" href="/login">Login</a>
      <a class="btn variant-filled-primary" href="/bookings">Bookings</a>
      <a class="btn variant-filled-primary" href="/admin">Map Editor</a>
      <a class="btn variant-filled-primary" href="/admin/analysis">Analysis</a>
      <a class="btn variant-filled-primary" href="/extendedUser">Extended User</a>
    
    </div> -->
	</div>

	<div class="hidden md:block">
		<div
			class="absolute flex flex-col top-1/2 -translate-y-1/2 lg:right-11 right-2 w-52 border-2 border-primary-300 bg-surface-50 rounded-xl shadow-around-10"
		>
			<a
				href="/bookings"
				class="btn rounded-none rounded-t-[10px] w-full hover:bg-primary-500 hover:bg-opacity-[15%]"
			>
				<p class="leading-7 [&:not(:first-child)]:mt-6">Bookings</p></a
			>

			<a
				href={`/admin?building=${buildingName}&floor=${floorName}`}
				class="btn rounded-none w-full hover:bg-primary-500 hover:bg-opacity-[15%]"
			>
				<p class="leading-7 [&:not(:first-child)]:mt-6">Map Creator</p></a
			>

			<a
				href="/admin/analysis"
				class="btn rounded-none w-full hover:bg-primary-500 hover:bg-opacity-[15%]"
			>
				<p class="leading-7 [&:not(:first-child)]:mt-6">Analysis</p></a
			>

			<a href="/user" class="btn rounded-none w-full hover:bg-primary-500 hover:bg-opacity-[15%]">
				<p class="leading-7 [&:not(:first-child)]:mt-6">User</p></a
			>

			<a
				href="/login"
				class="btn rounded-none rounded-b-[10px] border-surface-900 w-full hover:bg-primary-500 hover:bg-opacity-[15%]"
			>
				<p class="leading-7 [&:not(:first-child)]:mt-6">Change User</p>
			</a>
		</div>
	</div>

	<FloorSelection bind:floorName />

	<BuildingSelection bind:buildingName />
</div>
