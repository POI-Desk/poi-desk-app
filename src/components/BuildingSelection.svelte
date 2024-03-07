<script lang="ts">
  import { user } from "$lib/userStore";
  import { buildingid } from "$lib/buildingStore";
	import { getBuildings } from '$lib/queries/buildingQueries';

  import { getFloors } from "$lib/queries/floorQueries";

  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";

  $: locationid = $user.location?.pk_locationid!;

  $: buildings = $getBuildings.data?.getBuildingsInLocation;

  async function selectFirstBuilding() {
    if (!locationid) return;
    await getBuildings.fetch({ variables: { locationid } });

    if (buildings) {
      $buildingid = buildings[0]?.pk_buildingid || ""; // Set to the first building
    }
  }

  $: if (locationid) selectFirstBuilding();

  $: {
    if ($buildingid) {
      getFloors.fetch({ variables: { buildingid: $buildingid } });
    }
  }
</script>

<RadioGroup
  border="none"
  padding="px-5 py-2"
  active="variant-filled-primary"
  hover="hover:variant-soft-primary"
  background="none"
>
  <div
    class="absolute md:w-2/5 xl:w-1/5 w-3/5 h-11 bottom-28 left-1/2 z-[100]
    rounded-full -translate-x-1/2 bg-surface-50-900-token border-2 border-primary-300 shadow-around-10
    grid grid-cols-{buildings?.length ?? 1} divide-x-2 divide-primary-300 "
  >
    {#if $getBuildings.fetching}
      <div class="h-full rounded-full placeholder animate-pulse" />
    {:else}
      {#each buildings ?? [] as building, index}
        <RadioItem bind:group={$buildingid}
                   name="buildings"
                   value={building?.pk_buildingid}
                   class="flex items-center justify-center"
        >
          <p class="select-none font-semibold">
            {building.buildingname}
          </p>
        </RadioItem>
      {/each}
    {/if}
  </div>
</RadioGroup>
