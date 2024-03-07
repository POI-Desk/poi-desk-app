<script lang="ts">
  import { floorid } from "$lib/stores/floorStore";
  import { buildingid } from "$lib/stores/buildingStore";
  import { getFloors } from "$lib/queries/floorQueries";
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";

  $: floors = $getFloors.data?.getFloorsInBuilding;

  async function selectFirstFloor() {
    await getFloors.fetch({ variables: { buildingid: $buildingid } });

    if (floors) {
      $floorid = floors[0]?.pk_floorid || ""; // Set to the first floor
    }
  }

  $: {
    if ($buildingid) selectFirstFloor();
  }
</script>

<RadioGroup
  border="none"
  padding="px-2 py-10"
  active="variant-filled-primary"
  hover="hover:variant-soft-primary"
  background="none"
>
  <div
    class="absolute w-11 left-4 md:left-11 top-1/2 z-[100] rounded-full -translate-y-1/2 bg-surface-50-900-token
    border-2 border-primary-300 shadow-around-10 grid grid-rows-{floors?.length} divide-y-2 divide-primary-300"
  >
    {#if $getFloors.fetching}
      <div class="h-full rounded-full placeholder animate-pulse" />
    {:else}
      {#each floors ?? [] as floor}
<!--        <div class="flex justify-center items-center">-->
          <RadioItem bind:group={$floorid}
                     name="floors"
                     value={floor?.pk_floorid ?? ''}
                     class="flex items-center justify-center">
            <p class="select-none font-semibold">
              {floor?.floorname.split(' ')[0]}
            </p>
          </RadioItem>
<!--        </div>-->
      {/each}
    {/if}
  </div>
</RadioGroup>