<script lang="ts">
	import DateSelection from '$components/DateSelection.svelte';

	import { goto } from '$app/navigation';
	import BuildingSelection from '$components/BuildingSelection.svelte';
	import FloorSelection from '$components/FloorSelection.svelte';
	import FloorMap from '$components/MapComponents/FloorMap.svelte';
	import { user } from '$lib/userStore';
	import { onMount } from 'svelte';

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
		<a class="btn variant-filled-primary" href="./admin/maps">Map Editor</a>
		<a class="btn variant-filled-primary" href="./analysis">Analysis</a>
		<DateSelection />
	</div>
	<FloorSelection />

	<BuildingSelection />
</div>
