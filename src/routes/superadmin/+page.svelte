<script lang="ts">
	import AddBuilding from "$components/SuperAdminComponents/AddBuilding.svelte";
	import AddLocation from "$components/SuperAdminComponents/AddLocation.svelte";
	import LocationList from "$components/SuperAdminComponents/LocationList.svelte";
	import { addBuilding } from '$lib/mutations/buildings';
	import { addFloor } from "$lib/mutations/floors";
	import { addLocation } from '$lib/mutations/locationMutations';
	import { isSaveDisabled, newBuildings, newFloors, locationNames, newLocation, refreshLocations } from "$lib/superAdminStore"


	async function saveLocationChanges() {
		console.log($locationNames);
		console.log($newLocation.name);
		
		if (!$newLocation.name) {
			alert('You have to enter a name before saving the location!');
		} else if ($locationNames.includes($newLocation.name.toLowerCase())) {
			alert('A location with this name already exists. Please enter a different name!');
		} else {
			const result = await addLocation.mutate({
				name: $newLocation.name
			}).then((value) => {
				
				
				console.log("LOCATION")
				console.log(value);
				
				console.log("id: " + value.data?.addLocation?.pklocationid);
				saveBuildingChanges(value.data?.addLocation?.pklocationid);
				
				$isSaveDisabled = true;
				$refreshLocations = !$refreshLocations;
			});
		}
	}

	async function saveBuildingChanges(locationid: any) {
		if ($newBuildings.some(building => building.name === "")) {
			alert('Missing building name');
		} else {
			for (const building of $newBuildings) {
				const result = await addBuilding.mutate({
					locationid: locationid,
					name: building.name
				}).then((value) => {
					console.log("BUILDING")
					console.log(value);
					
					$isSaveDisabled = true;
					saveFloorChanges(building.id, value.data?.addBuilding?.pk_buildingid);

				});
			}
			
        }
	}

	async function saveFloorChanges(mgmtId: any, buildingid:any) {
		if ($newFloors.some(floor => floor.name === "")) {
			alert('Missing floor name');
		} else {
			const currentFloors = $newFloors.filter((f) => f.buildingid === mgmtId);
			for (const floor of currentFloors) {
				const result = await addFloor.mutate({
					buildingid,
					name: floor.name
				});
				console.log("FLOOR")
				console.log(result)
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