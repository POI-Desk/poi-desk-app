<script lang="ts">
  import { CachePolicy } from "$houdini";
  import { deleteBuilding } from "$lib/mutations/buildings";
  import { getBuildings } from "$lib/queries/buildingQueries";
  import { onMount } from "svelte";
  import {
    admins,
    adminsOfLocation,
    adminsToRemove,
    buildingToEdit,
    isSaveDisabled,
    locationNames,
    locationToEdit,
    refreshLocations
  } from "$lib/superAdminStore";
  import AddBuilding from "./AddBuilding.svelte";
  import { getAdminUsers } from "$lib/queries/userQuerries";
  import type { User } from "$lib/types/userTypes";
  import AddAdminToLocation from "./AddAdminToLocation.svelte";
  import { PenLine, Trash2 } from "lucide-svelte";

  $: buildings = $getBuildings.data?.getBuildingsInLocation;

  $: locationIdToEdit = $locationToEdit.id;

  async function onDeleteBuilding(id: string) {
    const result = await deleteBuilding.mutate({
      id: id
    });
    $refreshLocations = !$refreshLocations;
  }


  onMount(() => {
    getAdmins();
  });

  /**
   * gets all admin users currently existing
   */
  async function getAdmins() {
    $admins = [];
    await getAdminUsers.fetch({ policy: CachePolicy.NetworkOnly }).then(() => {
      $admins = $getAdminUsers.data?.getAdminUsers;
    });
    // console.log($admins);
  }
  

  function handleNameInput() {
    if ($locationToEdit.name === "" || $locationNames.includes($locationToEdit.name)) {
      $isSaveDisabled = true;
    } else {
      $isSaveDisabled = false;
    }
  }

  function handleRemoveAdmin(admin: User) {
    $adminsToRemove.push(admin);
    $adminsToRemove = $adminsToRemove;
    $adminsOfLocation.splice($adminsOfLocation.indexOf(admin), 1);
    $adminsOfLocation = $adminsOfLocation;
    console.log($adminsOfLocation);
    $isSaveDisabled = false;
  }
</script>

<div class="flex flex-col gap-5">
  {#key $refreshLocations}

    {#await getBuildings.fetch({ variables: { locationid: locationIdToEdit }, policy: CachePolicy.NetworkOnly })}
      <p>fetching buildings...</p>
    {:then fetched}
      <div class="input p-1">
        <input
          type="text"
          class="input bg-white col-span-4 p-3"
          bind:value={$locationToEdit.name}
          on:input={handleNameInput}>
      </div>

      {#each buildings ?? [] as building}
        <div class="input p-1 grid grid-cols-4 gap-1">
          <div class="col-span-2 text-center bg-white rounded-full p-2 bold">{building.buildingname}</div>

          <button
            class="btn flex justify-center items-center variant-filled-primary"
            on:click={() => {
                $buildingToEdit = {id: building.pk_buildingid, name: building.buildingname};
							}}>
            <PenLine />
          </button>

          <button
            class="btn flex justify-center items-center variant-filled-error text-white"
            on:click={() => onDeleteBuilding(building.pk_buildingid)}>
            <Trash2 />
          </button>
        </div>
      {/each}
    {/await}

    <AddBuilding />

    <!--	TODO auslagern	-->

    <h2>Admins of {$locationToEdit.name}</h2>

    {#if $adminsOfLocation}
      {#each $adminsOfLocation as admin}
        <button on:click={() => handleRemoveAdmin(admin)}>X</button>{admin.username}<br />
      {/each}
    {/if}

    <AddAdminToLocation />
  {/key}
</div>
