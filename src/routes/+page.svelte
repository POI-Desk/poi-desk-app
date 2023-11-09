<script lang="ts">
	import DateSelection from '$components/DateSelection.svelte';

	import BuildingSelection from '$components/BuildingSelection.svelte';
	import SeatsOnFloor from '$components/DesksOnFloor.svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import { user } from '$lib/userStore';
	import FloorMap from '$components/MapComponents/FloorMap.svelte';
	import FloorSelection from '$components/FloorSelection.svelte';
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
  <FloorMap />

  <div class="absolute top-3">
    <a class="btn variant-filled-primary" href="./login">Login</a>
    <a class="btn variant-filled-primary" href="./location">Location</a>
    <a class="btn variant-filled-primary" href="./admin/maps">Map Editor</a>
    <DateSelection />
  </div>
	<!--Debugging-->
	<!-- <p>{$user.pk_userid ?? 'no id'}</p>
	<p>{$user.username ?? 'no username'}</p>
	<p>{$user.location?.locationname ?? 'no location'}</p>
	<p>{$user.location?.pk_locationid ?? 'no location'}</p> -->
	<!---->
	<!-- <SearchBar /> -->
  
  <div class="absolute left-3 top-1/2 -translate-y-1/2">
    <FloorSelection />
  </div>
  
	<div class="flex justify-center">
    <div class="absolute bottom-20">
      <BuildingSelection />
		</div>
	</div>
  
  
  <!-- <SeatsOnFloor /> -->

</div>
