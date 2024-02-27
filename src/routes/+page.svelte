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
      
      <LightSwitch />
    </div> -->
	</div>

	<div
		class="absolute flex flex-col top-1/2 -translate-y-1/2 lg:right-11 right-2 w-52 border-2 border-primary-300 bg-surface-50 rounded-xl shadow-around-10"
	>
		<a
			href="/bookings"
			class="btn rounded-none rounded-t-[10px] w-full hover:bg-primary-500 hover:bg-opacity-[15%]"
			>Bookings</a
		>

		<a href="/admin" class="btn rounded-none w-full hover:bg-primary-500 hover:bg-opacity-[15%]"
			>Map Creator</a
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

	<FloorSelection />

	<BuildingSelection />
</div>
