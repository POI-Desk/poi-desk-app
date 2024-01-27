<script lang="ts">
	import DateSelection from '$components/DateSelection.svelte';

	import BuildingSelection from '$components/BuildingSelection.svelte';
	import FloorSelection from '$components/FloorSelection.svelte';
	import FloorMap from '$components/MapComponents/FloorMap.svelte';
	import { onMount } from 'svelte';
	import { user } from '$lib/userStore';
	import { goto } from '$app/navigation';
	import { isExtended } from "$lib/stores/extendedUserStore";

	onMount(() => {
		if (!$user.pk_userid) {
			goto('/login');
		}
	});

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
</script>

<!--{#if visible}-->
<!--	<CrazyAnimation>-->
<!--		<Check />-->
<!--	</CrazyAnimation>-->
<!--{/if}-->

<div class="overflow-hidden h-screen">
	<FloorMap />

	<div class="absolute m-3">
		<a class="btn variant-filled-primary" href="./login">Login</a>
		<a class="btn variant-filled-primary" href="./location">Location</a>
		<a class="btn variant-filled-primary" href="./bookings">Bookings</a>
		<a class="btn variant-filled-primary" href="./admin/maps">Map Editor</a>
		<a class="btn variant-filled-primary" href="./analysis">Analysis</a>
		<a class="btn variant-filled-primary" href="./extendedUser">Extended User</a>
		<DateSelection />
	</div>

	<FloorSelection />

	<BuildingSelection />
</div>
