<script lang="ts">
  import { getBuildings } from "$lib/queries/buildingQueries";
  import { onMount } from "svelte";
  import { locationid } from "$lib/locationStore";
  import { buildingToEdit, editBuildingclicked, isSaveDisabled, newBuildings } from "$lib/superAdminStore";
  import BuildingInput from "./BuildingInput.svelte";
  import { v4 as uuidv4 } from "uuid";
  import { PenLine, Trash2 } from "lucide-svelte";

  $: locid = $locationid;

  let buildingNames: String[] = [];
  let showAddBuilding: boolean = false;
  let newName: String = "";
  let editedBuildingId: uuidv4;
  $newBuildings = [];
  $editBuildingclicked = false;


  onMount(async () => {
    await getBuildings.fetch({ variables: { locationid: locid } });
    let buildings = $getBuildings.data?.getBuildingsInLocation;
    for (let building in buildings) {
      buildingNames.push(building.buildingname);
    }
  });

  function handleAddBuilding() {
    showAddBuilding = true;
    const newId = uuidv4();
    $newBuildings.push({ id: newId, name: "" });
    $newBuildings = $newBuildings;

  }

  function updateNewNames(id: uuidv4, newName: string) {
    $newBuildings = $newBuildings.map((field) =>
      field.id === id ? { ...field, name: newName } : field
    );

    $isSaveDisabled = false;
    $newBuildings.forEach((building) => {
      if (building.name === "") {
        $isSaveDisabled = true;
      }
    });
  }

  function removeBuildingInput(id: uuidv4, name: string) {
    const index = $newBuildings.findIndex((b) => b.id === id);
    $newBuildings.splice(index, 1);
    $newBuildings = $newBuildings;
  }
</script>

<div class="flex flex-col gap-5">
  <h1 class="h2 text-primary-500-400-token m-1">Buildings</h1>

  {#if showAddBuilding}
    {#each $newBuildings as { id, name }}
      <div class="input grid grid-cols-4 p-1 gap-1">
        <BuildingInput {id} {name} onInput={(newId, newName) => updateNewNames(newId, newName)} />

        <button
          class="btn flex justify-center items-center variant-filled-primary"
          on:click={() => {
						$buildingToEdit = {id, name};
						$editBuildingclicked = true;
						}}>
          <PenLine />
        </button>

        <button
          class="btn flex justify-center items-center variant-filled-error text-white"
          on:click={() => removeBuildingInput(id, name)}>
          <Trash2 />
        </button>
      </div>
    {/each}
  {/if}

  <div class="input grid grid-cols-4 justify-between items-center p-1 gap-1">
    <div class="flex justify-center col-span-3 text-center bg-white rounded-full p-3">New building</div>
    <button class="btn variant-filled-primary text-xl inline-flex items-center justify-center align-middle"
            on:click={handleAddBuilding}>+
    </button>
  </div>
</div>
