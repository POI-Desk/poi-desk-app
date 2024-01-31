<script lang="ts">
	import AddBuilding from "$components/SuperAdminComponents/AddBuilding.svelte";
	import AddLocation from "$components/SuperAdminComponents/AddLocation.svelte";
	import AddFloor from "$components/SuperAdminComponents/AddFloor.svelte";
	import LocationList from "$components/SuperAdminComponents/LocationList.svelte";
	import { addBuilding } from '$lib/mutations/buildings';
	import { addLocation } from '$lib/mutations/locationMutations';
	import { isSaveDisabled, newBuildingNames, locationNames, newLocation, refreshLocations } from "$lib/superAdminStore"


	async function saveLocationChanges() {
		console.log($newLocation.name);
		
		if (!$newLocation.name) {
			alert('You have to enter a name before saving the location!');
		} else if ($locationNames.includes($newLocation.name.toLowerCase())) {
			alert('A location with this name already exists. Please enter a different name!');
		} else {
			const result = await addLocation.mutate({
				id: $newLocation.id,
				name: $newLocation.name
			});
			saveBuildingChanges(result.data?.addLocation?.pk_locationid ?? '');
			$isSaveDisabled = true;
			$refreshLocations = !$refreshLocations;
		}
	}

	async function saveBuildingChanges(locationid: any) {
		for (const buildingName of $newBuildingNames) {
			//if (buildingNames.includes(building)) {
            //    alert('Duplicate building name')
            //    return;
			//}
		}
		if ($newBuildingNames.includes('')) {
			alert('Missing building name');
		} else {
			for (const buildingName of $newBuildingNames) {

				const result = await addBuilding.mutate({
					locationid,
					name: buildingName
				});
				$isSaveDisabled = true;
			}
        }
	}
</script>

<AddLocation />
<AddBuilding />	


<br>

<button disabled={$isSaveDisabled} class="btn variant-filled-primary" on:click={saveLocationChanges}
	>Save Changes</button>

<LocationList />