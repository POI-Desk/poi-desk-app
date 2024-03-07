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
    locationToEdit, newAdmins,
    refreshLocations
  } from "$lib/stores/superAdminStore";
  import AddBuilding from "./AddBuilding.svelte";
  import { getAdminUsers } from "$lib/queries/userQueries";
  import type { User } from "$lib/types/userTypes";
  import AddAdminToLocation from "./AddAdminToLocation.svelte";
  import { PenLine, Trash2 } from "lucide-svelte";

  $: buildings = $getBuildings.data?.getBuildingsInLocation;

  $: locationIdToEdit = $locationToEdit.id;

  $: {
    $locationToEdit;
    $newAdmins = [];
  }

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
  }


  function handleNameInput() {
    // if ($locationToEdit.name === "" || $locationNames.includes($locationToEdit.name)) {
    //   $isSaveDisabled = true;
    // } else {
    //   $isSaveDisabled = false;
    // }
  }

  function handleRemoveAdmin(admin: User) {
    $adminsToRemove.push(admin);
    $adminsToRemove = $adminsToRemove;
    $adminsOfLocation.splice($adminsOfLocation.indexOf(admin), 1);
    $adminsOfLocation = $adminsOfLocation;
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

    <div class="flex flex-col">
      <h2 class="font-bold">Admins of {$locationToEdit.name}</h2>

      <AddAdminToLocation />

      {#if $adminsOfLocation}
        {#each $adminsOfLocation as admin}
          <div class="grid grid-cols-4 items-center gap-2 variant-filled-tertiary rounded-full p-2 py-1 bold my-2">
            <span class="col-span-3 bg-white rounded-full py-2 p-1 text-center">{admin.username}</span>
            <button
              class="btn flex flex-row justify-center items-center variant-filled-error text-white"
              on:click={() => handleRemoveAdmin(admin)}>
              <Trash2 />
            </button>
          </div>
        {/each}
      {/if}

      {#each $newAdmins as newAdmin}
        <div class="grid grid-cols-4 items-center gap-2 variant-filled-tertiary rounded-full p-2 py-1 bold my-2">
          <span class="col-span-3 bg-white rounded-full py-2 p-1 text-center">{newAdmin.username}</span>
          <button
            class="btn variant-filled-error text-white"
            on:click={() => {
            $newAdmins.splice($newAdmins.indexOf(newAdmin), 1);
            $newAdmins = $newAdmins;
          }}>
            <Trash2 />
          </button>
        </div>
      {/each}
    </div>
  {/key}
</div>
