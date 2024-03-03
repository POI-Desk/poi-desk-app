<script lang="ts">
  import { CachePolicy } from "$houdini";
  import { deleteLocation } from "$lib/mutations/locationMutations";
  import { getAdminsOfLocation, getLocations } from "$lib/queries/locationQueries";
  import { onMount } from "svelte";
  import {
    admin,
    adminsOfLocation,
    buildingToEdit,
    isSaveDisabled,
    locationNames,
    locationToEdit,
    refreshLocations
  } from "$lib/superAdminStore";
  import { showAddLocation } from "$lib/locationStore";
  import { PenLine, Trash2 } from "lucide-svelte";

  $: locations = $getLocations?.data?.getAllLocations;

  onMount(() => {
    getLocationsFunction();
  });


  $: adminsOfLoc = $getAdminsOfLocation.data?.getAdminsOfLocation;

  async function getAdminsOfLocationFunction() {
    const result = await getAdminsOfLocation.fetch({
      variables: { locationid: $locationToEdit.id },
      policy: CachePolicy.NetworkOnly
    }).then((value) => {
      $adminsOfLocation = adminsOfLoc;
    });
  }

  async function getLocationsFunction() {
    await getLocations.fetch({ policy: CachePolicy.NetworkOnly }).then(() => {
      $locationNames = [""];
      let locations = $getLocations.data?.getAllLocations;

      for (let i = 0; i < locations?.length; i++) {
        $locationNames.push(locations?.at(i)?.locationname.toLowerCase() ?? "");
        $locationNames = $locationNames;
      }
    });
  }

  async function onDeleteLocation(id: string) {
    console.log(id);

    const result = await deleteLocation.mutate({
      id: id
    });
    $refreshLocations = !$refreshLocations;
    getLocationsFunction();
  }

  function compare(a, b) {
    const aName = a.locationname.toLowerCase();
    const bName = b.locationname.toLowerCase();

    if (aName < bName) {
      return -1;
    }
    if (aName > bName) {
      return 1;
    }
    return 0;
  }
</script>

<div>
  {#key $refreshLocations}
    {#await getLocations.fetch({ policy: CachePolicy.NetworkOnly })}
      <p>fetching locations...</p>
    {:then fetched}
      {#each locations.sort((a, b) => compare(a, b)) as location}
        <div>
          <div class="input p-1 grid grid-cols-4 gap-1">
            <div class="col-span-2 text-center bg-white rounded-full p-2 bold">{location.locationname}</div>

            <button
              class="btn flex justify-center items-center variant-filled-primary"
              on:click={() => {
								$showAddLocation = false;
								$locationToEdit.id = location.pk_locationid;
								$locationToEdit.name = location.locationname;
								$buildingToEdit.id = '';
								getAdminsOfLocationFunction();
								$isSaveDisabled = true;
								$admin = {pk_userid: "", name: ""};
								$adminsOfLocation = [];
							}}>
              <PenLine />
            </button>

            <button
              class="btn flex justify-center items-center variant-filled-error text-white"
              on:click={() => onDeleteLocation(location.pk_locationid)}>
              <Trash2 />
            </button>
          </div>
          <br />
        </div>
      {/each}
    {/await}
  {/key}
</div>
