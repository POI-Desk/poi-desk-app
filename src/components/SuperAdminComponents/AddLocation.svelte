<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import { getLocations } from "$lib/queries/locationQueries";
  import { onMount } from "svelte";
  import { showAddLocation } from "$lib/locationStore";
  import { isSaveDisabled, locationNames, locationToEdit, newLocation } from "$lib/superAdminStore";
  import { CachePolicy } from "$houdini";


  onMount(() => {
    getLocationsFunction();
    showAddLocation.set(false);
  });

  async function getLocationsFunction() {
    $locationNames = [""];
    await getLocations.fetch({ policy: CachePolicy.NetworkOnly }).then(() => {
      let locations = $getLocations.data?.getAllLocations;

      for (let i = 0; i < locations?.length; i++) {
        $locationNames.push(locations?.at(i)?.locationname.toLowerCase() ?? "");
      }
    });
  }

  function onAddLocation() {
    $locationToEdit.id = "";
    showAddLocation.set(true);
    const newId = uuidv4();
    $newLocation.id = newId;
  }

  function handleNameInput() {
    if ($newLocation.name === "" || $locationNames.includes($newLocation.name)) {
      $isSaveDisabled = true;
    } else {
      $isSaveDisabled = false;
    }
  }
</script>

<h1 class="h2 text-primary-500-400-token m-1">Locations</h1>

<div class="input grid grid-cols-4 justify-between items-center p-1 gap-1">
  {#if !$showAddLocation}
    <div class="flex justify-center col-span-3 text-center bg-white rounded-full p-3">New location</div>
  {:else }
    <input
      class="input bg-white col-span-4"
      type="text"
      placeholder="Enter a name"
      bind:value={$newLocation.name}
      on:input={handleNameInput}
    />
  {/if}
  {#if !$showAddLocation}
    <button class="btn variant-filled-primary text-xl inline-flex items-center justify-center align-middle"
            on:click={onAddLocation}>+
    </button>
  {/if}
</div>
