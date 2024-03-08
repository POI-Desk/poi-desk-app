<script lang="ts">
  import AddBuilding from "$components/SuperAdminComponents/AddBuilding.svelte";
  import AddLocation from "$components/SuperAdminComponents/AddLocation.svelte";
  import EditBuilding from "$components/SuperAdminComponents/EditBuilding.svelte";
  import EditLocation from "$components/SuperAdminComponents/EditLocation.svelte";
  import LocationList from "$components/SuperAdminComponents/LocationList.svelte";
  import { addBuilding, changeNameOfBuilding } from "$lib/mutations/buildings";
  import { getLocations } from "$lib/queries/locationQueries";
  import { addFloor, changeNameOfFloor } from "$lib/mutations/floors";
  import { addLocation, changeNameOfLocation } from "$lib/mutations/locationMutations";
  import { removeAdminLocation, setAdminLocation } from "$lib/mutations/user";
  import {
    admin,
    adminsToRemove,
    buildingToEdit,
    changedBuildings,
    editBuildingclicked,
    floorsToEdit,
    isSaveDisabled,
    locationNames,
    locationToEdit,
    newAdmins,
    newBuildings,
    newFloors,
    newLocation,
    refreshLocations
  } from "$lib/stores/superAdminStore";
  import { CachePolicy } from "$houdini";
  import { showAddLocation } from "$lib/stores/locationStore";
  import AddFloor from "$components/SuperAdminComponents/AddFloor.svelte";
  import BurgerMenu from "$components/SuperAdminComponents/BurgerMenu.svelte";
  import { goto } from "$app/navigation";
  import { quintInOut, quintOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  /**
   * Handles when the save button should be enabled or disabled
   */
  $: {
    $isSaveDisabled =
      ($newAdmins.length === 0)
      && ($locationToEdit.name === "" || $locationNames.includes($locationToEdit.name.toLowerCase()))
      && ($changedBuildings.size === 0)
      && ($floorsToEdit.size === 0)
    ;
  }

  /**
   * updates the locationNames-list, which is used for checking whether a location name is already in use
   */
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

  /**
   * determines whether only changes to the location have been made or to a building or floor as well
   */
  function saveEditChanges() {
    saveEditLocationChanges();
    saveBuildingChanges($locationToEdit.id);

    if ($changedBuildings.size > 0) {
      saveEditBuildingChanges();
    }

    if ($floorsToEdit.size > 0) {
      saveEditFloorChanges();
    }
  }

  /**
   * determines whether a new location has been added or an existing one has been edited
   * calls saveBuildingChanges
   */
  async function saveLocationChanges() {
    if ($locationToEdit.id !== "") {
      saveEditChanges();
    } else {
      if (!$newLocation.name) {
        alert("You have to enter a name before saving the location!");
      } else if ($locationNames.includes($newLocation.name.toLowerCase())) {
        alert("A location with this name already exists. Please enter a different name!");
      } else {
        const result = await addLocation
          .mutate({
            name: $newLocation.name
          })
          .then((value) => {
            saveAdminToLocation(value.data?.addLocation?.pk_locationid ?? "");
            saveBuildingChanges(value.data?.addLocation?.pklocationid);

            $isSaveDisabled = true;
            getLocationsFunction();
            $admin = { pk_userid: "", name: "" };
            $refreshLocations = !$refreshLocations;
          });
      }
    }
    getLocationsFunction();
  }

  /**
   * saves the selected admin users to a location
   * @param locationid
   */
  function saveAdminToLocation(locationid: string) {
    $newAdmins.forEach(async (a) => {
      const result = await setAdminLocation
        .mutate({
          userid: a.pk_userid,
          locationid: locationid
        })
        .then((value) => {
          $newAdmins = [];
          $admin = { pk_userid: "", name: "" };
        });
    });
  }

  /**
   * saves the buildings added
   * @param locationid id of the location in which the building was added
   */
  async function saveBuildingChanges(locationid: any) {
    if ($newBuildings.some((building) => building.name === "")) {
      alert("Missing building name");
    } else {
      for (const building of $newBuildings) {
        const result = await addBuilding
          .mutate({
            locationid: locationid,
            name: building.name
          })
          .then((value) => {
            $refreshLocations = !$refreshLocations;
            $isSaveDisabled = true;
            saveFloorChanges(building.id, value.data?.addBuilding?.pk_buildingid);
          });
      }
    }
  }

  /**
   * saves the floors added
   * @param mgmtId id to determine to which building the floor belongs
   * @param buildingid id of the already created building; buildingid as it is saved in the database
   */
  async function saveFloorChanges(mgmtId: any, buildingid: any) {
    if ($newFloors.some((floor) => floor.name === "")) {
      alert("Missing floor name");
    } else {
      const currentFloors = $newFloors.filter((f) => f.buildingid === mgmtId);
      for (const floor of currentFloors) {
        const result = await addFloor.mutate({
          buildingid,
          name: floor.name
        });
      }
    }
  }

  /**
   * saves the changes made to an edited location
   */
  async function saveEditLocationChanges() {
    const result = await changeNameOfLocation
      .mutate({
        id: $locationToEdit.id,
        newName: $locationToEdit.name
      })
      .then((value) => {
        let adminIds = value.data?.changeNameOfLocation?.admins?.map((a) => a?.pk_userid);
        if (!adminIds?.includes($admin.pk_userid)) {
          saveAdminToLocation(value.data?.changeNameOfLocation?.pk_locationid ?? "");
        }
        if ($adminsToRemove) {
          removeAdmins(value.data?.changeNameOfLocation?.pk_locationid ?? "");
        }
      });
    $isSaveDisabled = true;
    $refreshLocations = !$refreshLocations;
    // }
  }

  async function removeAdmins(locationid: string) {
    $adminsToRemove.forEach(async (a) => {
      const result = await removeAdminLocation.mutate({
        userid: a.pk_userid
      });
    });
    $adminsToRemove = [];
  }

  /**
   * saves the changes made to an edited building
   */
  async function saveEditBuildingChanges() {
    $changedBuildings.forEach(async (building, id) => {
      const result = await changeNameOfBuilding.mutate({
        id,
        newName: building
      }).then((building) => {
        if ($newFloors.length > 0) {
          const curBuildingId = building.data?.changeNameOfBuilding?.pk_buildingid;
          saveFloorChanges(curBuildingId, curBuildingId);
        }
      });
    });

    $changedBuildings = new Map();
    $isSaveDisabled = true;
  }

  /**
   * saves the changes made to an edited floor
   */
  async function saveEditFloorChanges() {
    $floorsToEdit.forEach(async (floor, id) => {
      const result = await changeNameOfFloor.mutate({
        id: id,
        newName: floor
      });
    });

    $floorsToEdit = new Map();
    $isSaveDisabled = true;
  }

  const btn = "btn variant-filled-primary shadow-md";
</script>

<div class="grid grid-cols-3 gap-5 divide-x-2 divide-black dark:divide-white h-full">

  <div class="p-5 flex flex-col gap-5">
    <AddLocation />
    <LocationList />
  </div>

  <div class="p-5 flex flex-col gap-5">
    {#if $showAddLocation}
      <div class="p-5 flex flex-col gap-5"
           transition:slide={{ delay: 25, duration: 300, easing: quintInOut, axis: 'y' }}>
        <h1 class="h2 text-primary-500-400-token m-1">Buildings</h1>

        <AddBuilding />

        <button disabled={$isSaveDisabled}
                class="btn variant-filled-primary"
                on:click={saveLocationChanges}>
          Save Changes
        </button
        >
      </div>
    {/if}

    {#if $locationToEdit.id !== ''}
      <h1 class="h2 text-primary-500-400-token m-1">Buildings</h1>

      <EditLocation />
      <button disabled={$isSaveDisabled}
              class="btn variant-filled-primary bottom-2"
              on:click={saveLocationChanges}>
        Save Changes
      </button
      >
    {/if}
  </div>

  <div class="p-5">
    {#if $locationToEdit.id !== '' && $buildingToEdit.id !== ''}
      <div class="flex flex-col gap-5" transition:slide={{ delay: 25, duration: 300, easing: quintInOut, axis: 'y' }}>
        <h1 class="h2 text-primary-500-400-token m-1">Floors</h1>
        <EditBuilding />
        <AddFloor />
      </div>
    {/if}

    {#if $showAddLocation && $editBuildingclicked}
      <div class="flex flex-col gap-5" transition:slide={{ delay: 25, duration: 300, easing: quintInOut, axis: 'y' }}>
        <h1 class="h2 text-primary-500-400-token m-1">Floors</h1>
        <AddFloor />
      </div>
    {/if}
  </div>
</div>

<div class="p-5">
  <BurgerMenu>
    <button on:click={() => goto("/")} class="{btn}">Home</button>
    <button on:click={() => goto("/superadmin/editUser")} class="{btn}">Edit Users</button>
  </BurgerMenu>
</div>