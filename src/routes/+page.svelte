<script lang="ts">
	import DateSelection from '$components/DateSelection.svelte';

	import BuildingSelection from '$components/BuildingSelection.svelte';
	import SeatsOnFloor from '$components/DesksOnFloor.svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import { user } from '$lib/userStore';
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
	<a class="btn variant-filled-primary" href="./analysis">Analysis</a>
	<!--Debugging-->
	<p>{$user.pk_userid ?? 'no id'}</p>
	<p>{$user.username ?? 'no username'}</p>
	<p>{$user.location?.locationname ?? 'no location'}</p>
	<p>{$user.location?.pk_locationid ?? 'no location'}</p>
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
