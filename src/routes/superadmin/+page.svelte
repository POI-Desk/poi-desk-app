<script lang="ts">
	import AddBuilding from '$components/SuperAdminComponents/AddBuilding.svelte';
	import AddLocation from '$components/SuperAdminComponents/AddLocation.svelte';
	import EditBuilding from '$components/SuperAdminComponents/EditBuilding.svelte';
	import EditLocation from '$components/SuperAdminComponents/EditLocation.svelte';
	import LocationList from '$components/SuperAdminComponents/LocationList.svelte';
	import { addBuilding, changeNameOfBuilding } from '$lib/mutations/buildings';
	import { getLocations } from '$lib/queries/locationQueries';
	import { getBuildings } from '$lib/queries/buildingQueries';
	import { addFloor, changeNameOfFloor } from '$lib/mutations/floors';
	import { addLocation, changeNameOfLocation } from '$lib/mutations/locationMutations';
	import {
		buildingToEdit,
		locationToEdit,
		isSaveDisabled,
		newBuildings,
		newFloors,
		locationNames,
		newLocation,
		floorsToEdit,
		changedBuidings,
		refreshLocations
	} from '$lib/superAdminStore';
	import { CachePolicy } from '$houdini';


	let buildings = $getBuildings.data?.getBuildingsInLocation;


	/**
	 * updates the locationNames-list, which is used for checking whether a location name is already in use
	*/
	async function getLocationsFunction() {
		await getLocations.fetch({ policy: CachePolicy.NetworkOnly }).then(() => {
			$locationNames = [""];
			let locations = $getLocations.data?.getAllLocations;

			for (let i = 0; i < locations?.length; i++) {
				$locationNames.push(locations?.at(i)?.locationname.toLowerCase() ?? '');
				$locationNames = $locationNames;
			}
		});
	}

	/**
	 * determines whether only changes to the location have been made or to a building or floor as well
	 */
	function saveEditChanges() {
		saveEditLocationChanges();

		if ($changedBuidings.size > 0) {
			saveEditBuildingChanges();
		}

		if ($floorsToEdit.size > 0) {
			saveEditFloorChanges();
		}
	}

	async function saveLocationChanges() {

		if ($locationToEdit.id !== '') {
			saveEditChanges();
		} else {
			if (!$newLocation.name) {
				alert('You have to enter a name before saving the location!');
			} else if ($locationNames.includes($newLocation.name.toLowerCase())) {
				alert('A location with this name already exists. Please enter a different name!');
			} else {
				const result = await addLocation
					.mutate({
						name: $newLocation.name
					})
					.then((value) => {
						console.log('LOCATION');
						console.log(value);

						console.log('id: ' + value.data?.addLocation?.pklocationid);
						saveBuildingChanges(value.data?.addLocation?.pklocationid);

						$isSaveDisabled = true;
						$refreshLocations = !$refreshLocations;
					});
			}
		}
		getLocationsFunction();
	}

	async function saveBuildingChanges(locationid: any) {
		if ($newBuildings.some((building) => building.name === '')) {
			alert('Missing building name');
		} else {
			for (const building of $newBuildings) {
				const result = await addBuilding
					.mutate({
						locationid: locationid,
						name: building.name
					})
					.then((value) => {
						console.log('BUILDING');
						console.log(value);

						$isSaveDisabled = true;
						saveFloorChanges(building.id, value.data?.addBuilding?.pk_buildingid);
					});
			}
		}
	}

	async function saveFloorChanges(mgmtId: any, buildingid: any) {
		if ($newFloors.some((floor) => floor.name === '')) {
			alert('Missing floor name');
		} else {
			const currentFloors = $newFloors.filter((f) => f.buildingid === mgmtId);
			for (const floor of currentFloors) {
				const result = await addFloor.mutate({
					buildingid,
					name: floor.name
				});
				console.log('FLOOR');
				console.log(result);
			}
		}
	}

	async function saveEditLocationChanges() {
		console.log($locationNames);
		console.log("new name: " + $locationToEdit.name);
		
		if ($locationNames.includes($locationToEdit.name.toLowerCase())) {
			alert('EDIT A location with this name already exists. Please enter a different name!');
		} else {
			const result = await changeNameOfLocation.mutate({
				id: $locationToEdit.id,
				newName: $locationToEdit.name
			});
			console.log(result);
			$isSaveDisabled = true;
			$refreshLocations = !$refreshLocations;
		}
	}

	async function saveEditBuildingChanges() {
		//console.log($locationNames);

		// if ($locationNames.includes($newLocation.name.toLowerCase())) {
		// 	alert('EDIT A location with this name already exists. Please enter a different name!');
		// } else {

		$changedBuidings.forEach(async (building, id) => {
			const result = await changeNameOfBuilding.mutate({
				id,
				newName: building
			});
			console.log(result);
		})

		$changedBuidings = new Map();
		$isSaveDisabled = true;
	}

	async function saveEditFloorChanges() {
		console.log("floorsToEdit:" + $floorsToEdit);

		$floorsToEdit.forEach(async (floor, id) => {
			console.log("FLOOOOOOOR");
			console.log(id + " name: " + floor);
			
			const result = await changeNameOfFloor.mutate({
			id: id,
			newName: floor
		})
		
		console.log(result);
	
	})
		
		$floorsToEdit = new Map();	
		$isSaveDisabled = true;
		//$refreshLocations = !$refreshLocations;
		//}
	}

</script>

<AddLocation />
<AddBuilding />

{#if $locationToEdit.id !== ''}
	{$locationToEdit.id}

	<EditLocation />
	{#if $buildingToEdit.id !== ''}
		<EditBuilding />
	{/if}
{/if}

<br />

<button disabled={$isSaveDisabled} class="btn variant-filled-primary" on:click={saveLocationChanges}
	>Save Changes</button
>

<LocationList />
