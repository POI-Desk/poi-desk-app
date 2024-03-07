<script lang="ts">
  import DateSelection from "$components/DateSelection.svelte";

  import BuildingSelection from "$components/BuildingSelection.svelte";
  import FloorSelection from "$components/FloorSelection.svelte";
  import FloorMap from "$components/MapComponents/FloorMap.svelte";
  import { goto } from "$app/navigation";
  import { isExtended } from "$lib/stores/extendedUserStore";
  import SearchBar from "$components/SearchBar.svelte";
  import { searchedUser } from "$lib/stores/searchStore";
  import CheckMarkAnimation from "$components/CheckMarkAnimation.svelte";
  import { Check } from "lucide-svelte";

  let visible = false;

  function playAnimation() {
    visible = true;
    setTimeout(() => {
      visible = false;
    }, 1000);
  }

  function handleUserClicked(event) {
    $searchedUser = event.detail;
    goto("/bookings/" + event.detail.username);
  }

  $isExtended = false; // TODO idk if this is a good idea.. but it works
</script>

{#if visible}
  <CheckMarkAnimation>
    <Check size="300" color="#8CAE68"/>
  </CheckMarkAnimation>
{/if}

<div class="overflow-hidden h-screen">
  <FloorMap />

  <div class="absolute p-8" style="width: 100%">
    <SearchBar showUsrInfo={true} on:clicked={handleUserClicked} />

    <div class="flex justify-center p-1">
      <DateSelection />
    </div>
  </div>

  <FloorSelection />

  <BuildingSelection />
</div>
