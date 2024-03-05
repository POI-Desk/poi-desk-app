<script lang="ts">
  import DateSelection from "$components/DateSelection.svelte";

  import BuildingSelection from "$components/BuildingSelection.svelte";
  import FloorSelection from "$components/FloorSelection.svelte";
  import FloorMap from "$components/MapComponents/FloorMap.svelte";
  import { onMount } from "svelte";
  import { user } from "$lib/userStore";
  import { goto } from "$app/navigation";
  import { isExtended } from "$lib/stores/extendedUserStore";
  import { LightSwitch } from "@skeletonlabs/skeleton";
  import SearchBar from "$components/SearchBar.svelte";
  import IntervalSelection from "$components/ExtendedBookingComponents/IntervalSelection.svelte";
  import { MapPin, Search } from "lucide-svelte";
	import { searchedUser } from "$lib/searchStore";

  // onMount(() => {
  //   if (!$user.pk_userid) {
  //     goto("/login");
  //   }
  // });

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

  function handleUserClicked(event) {
    $searchedUser = event.detail;
    goto("/bookings/" + event.detail.username)
  }

  $isExtended = false; // TODO idk if this is a good idea.. but it works
</script>

<!--{#if visible}-->
<!--	<CrazyAnimation>-->
<!--		<Check />-->
<!--	</CrazyAnimation>-->
<!--{/if}-->

<div class="overflow-hidden h-screen">
  <FloorMap />

  <div class="absolute p-8" style="width: 100%">
    <SearchBar showUsrInfo={true} on:clicked={handleUserClicked}/>

    <div class="flex justify-center p-1">
      <DateSelection />
    </div>
  </div>

  <FloorSelection />

  <BuildingSelection />

</div>
