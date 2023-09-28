<script lang="ts">
	import Check from '$components/Check.svelte';
	import CrazyAnimation from '$components/CrazyAnimation.svelte';
	import DateSelection from '$components/DateSelection.svelte';

	import type { PageData } from './$types';
	import SeatsOnFloor from '$components/DesksOnFloor.svelte';
	import { user } from '$lib/userStore';
	import { location } from '$lib/locationStore';
	import SearchBar from '$components/SearchBar.svelte';
	import BuildingSelection from '$components/BuildingSelection.svelte';
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

<div class="m-3">
	<a class="btn variant-filled-primary" href="./login">Login</a>

	<a class="btn variant-filled-primary" href="./location">Location</a>
	<!--Debugging-->
	<p>{$user?.pk_userid ?? 'no id'}</p>
	<p>{$user?.username ?? 'no username'}</p>
	<p>{$location?.locationname ?? 'no location'}</p>
	<p>{$location?.pk_locationid ?? 'no location'}</p>
	<!---->
	<SearchBar />

	<DateSelection />

	<div class="flex justify-center">
		<div class="absolute bottom-20">
			<BuildingSelection />
		</div>
	</div>

	<SeatsOnFloor />
</div>
