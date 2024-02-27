<script lang="ts">
	import { getDataStore } from './../../$houdini/plugins/houdini-svelte/stores/getData.js';
	import DateSelection from '$components/DateSelection.svelte';

	import BuildingSelection from '$components/BuildingSelection.svelte';
	import FloorSelection from '$components/FloorSelection.svelte';
	import FloorMap from '$components/MapComponents/FloorMap.svelte';
	import { onMount } from 'svelte';
	import { authId, user } from '$lib/userStore';
	import { goto } from '$app/navigation';
	import { isExtended } from '$lib/stores/extendedUserStore';
	import { loginWizzGoogol } from '$lib/queries/userQuerries';
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

    <div>
      <a class="btn variant-filled-primary" href="/login">Login</a>
      <a class="btn variant-filled-primary" href="/bookings">Bookings</a>
      <a class="btn variant-filled-primary" href="/admin">Map Editor</a>
      <a class="btn variant-filled-primary" href="/admin/analysis">Analysis</a>
      <a class="btn variant-filled-primary" href="/extendedUser">Extended User</a>
    </div>
  </div>

  <FloorSelection />

  <BuildingSelection />

</div>
