<script lang="ts">
  import { buildingToEdit, editBuildingclicked, newFloors } from "$lib/superAdminStore";
  import InputField from "./BuildingInput.svelte";
  import { v4 as uuidv4 } from "uuid";
	import { PenLine, Trash2 } from "lucide-svelte";


  export let buildingId = "";
  let floorNames: String[] = [];
  let showAddFloor: boolean = false;
  let newName: String = "";
  $newFloors = [];


  function handleAddFloor() {
    showAddFloor = true;
    const newId = uuidv4();
    $newFloors.push({ buildingid: $buildingToEdit.id, id: newId, name: "" });
    $newFloors = $newFloors;
  }

  function updateNewNames(id: uuidv4, newName: string) {
    $newFloors = $newFloors.map((field) =>
      field.id === id ? { ...field, name: newName } : field
    );
  }

  function removeBuildingInput(id: uuidv4, name: string) {
    const index = $newFloors.findIndex((b) => b.id === id);

    $newFloors.splice(index, 1);
    $newFloors = $newFloors;
  }
</script>

<div class="flex flex-col gap-5">
	<h1 class="h2 text-primary-500-400-token m-1">Floors</h1>

  {#if showAddFloor}
    {#each $newFloors as { id, name }}
      <div class="input grid grid-cols-4 p-1 gap-1">
        <InputField {id} {name} onInput={(newId, newName) => updateNewNames(newId, newName)} />

				<button
					class="btn flex justify-center items-center variant-filled-primary"
					on:click={() => {
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
		<div class="flex justify-center col-span-3 text-center bg-white rounded-full p-3">New floor</div>
		<button class="btn variant-filled-primary text-xl inline-flex items-center justify-center align-middle"
						on:click={handleAddFloor}>+
		</button>
	</div>
</div>
