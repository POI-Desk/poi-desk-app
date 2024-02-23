<script lang="ts">
  import { CachePolicy } from "$houdini";
  import { deleteFloor } from "$lib/mutations/floors";
  import { getFloors } from "$lib/queries/floorQueries";
  import { buildingToEdit, changedBuildings, floorsToEdit, refreshLocations } from "$lib/superAdminStore";
  import { PenLine, Trash2 } from "lucide-svelte";

  $: floors = $getFloors.data?.getFloorsInBuilding;

  $: buildingIdToEdit = $buildingToEdit.id;

  async function onDeleteFloor(id: string) {
    const result = await deleteFloor.mutate({
      id: id
    });
    $refreshLocations = !$refreshLocations;
  }

  function handleNameInput(id: string, name: string) {
    $changedBuildings.set(id, name);
    $changedBuildings = $changedBuildings;
  }

  function handleFloorNameInput(id: string, name: string) {
    $floorsToEdit.set(id, name);
    $floorsToEdit = $floorsToEdit;
  }
</script>

<div class="flex flex-col gap-5">
  {#key $refreshLocations}
    {#await getFloors.fetch({ variables: { buildingid: buildingIdToEdit }, policy: CachePolicy.NetworkOnly })}
      <p>fetching floors...</p>
    {:then fetched}
      <div class="input p-1">
        <input
          type="text"
          class="input bg-white col-span-4 p-3"
          bind:value={$buildingToEdit.name}
          on:input={() => handleNameInput($buildingToEdit.id, $buildingToEdit.name)}>
      </div>

      {#each floors as floor}
        <div class="input p-1 grid grid-cols-4 gap-1">
          <input
            type="text"
            class="col-span-3 text-center bg-white rounded-full p-2 bold"
            bind:value={floor.floorname}
            on:input={() => handleFloorNameInput(floor.pk_floorid, floor.floorname)}>

          <button
            class="btn flex justify-center items-center variant-filled-error text-white"
            on:click={() => onDeleteFloor(floor.pk_floorid)}>
            <Trash2 />
          </button>
        </div>
      {/each}
    {/await}
  {/key}
</div>
