<script lang="ts">
  import { v4 as uuidv4 } from "uuid";
  import { getLocations } from "$lib/queries/locationQueries";
  import { getAdminUsers } from "$lib/queries/userQuerries";
  import { onMount } from "svelte";
  import { showAddLocation } from "$lib/locationStore";
  import AddAdminToLocation from "./AddAdminToLocation.svelte";
  import { admins, isSaveDisabled, locationNames, locationToEdit, newAdmins, newLocation } from "$lib/superAdminStore";
  import { CachePolicy } from "$houdini";
  import type { User } from "$lib/types/userTypes";


  onMount(() => {
    getLocationsFunction();
    getAdmins();
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

  async function getAdmins() {
    $admins = [];
    await getAdminUsers.fetch({ policy: CachePolicy.NetworkOnly }).then(() => {
      $admins = $getAdminUsers.data?.getAdminUsers;
    });
    console.log(admins);
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

  function handleRemoveAdmin(newAdmin: User) {
    $newAdmins.splice($newAdmins.indexOf(newAdmin), 1);
    $newAdmins = $newAdmins;
  }

  // function handleSelect() {
  // 	if (!$newAdmins.includes($admin)) {
  // 		$newAdmins.push($admin);
  // 		$newAdmins = $newAdmins;
  // 	}
  // 	console.log($newAdmins);
  // }
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

<!--TODO auslagern-->

<AddAdminToLocation />

{#each $newAdmins as newAdmin}
  <button on:click={() => handleRemoveAdmin(newAdmin)}>X</button>{newAdmin.username}<br>
{/each}
