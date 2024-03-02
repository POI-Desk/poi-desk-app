<script lang="ts">
	import AddBuilding from '$components/SuperAdminComponents/AddBuilding.svelte';
	import AddLocation from '$components/SuperAdminComponents/AddLocation.svelte';
	import AddTeam from '$components/SuperAdminComponents/AddTeam.svelte';
	import EditBuilding from '$components/SuperAdminComponents/EditBuilding.svelte';
	import EditLocation from '$components/SuperAdminComponents/EditLocation.svelte';
	import LocationList from '$components/SuperAdminComponents/LocationList.svelte';
	import { addBuilding, changeNameOfBuilding } from '$lib/mutations/buildings';
	import { getLocations } from '$lib/queries/locationQueries';
	import { addFloor, changeNameOfFloor } from '$lib/mutations/floors';
	import { addLocation, changeNameOfLocation } from '$lib/mutations/locationMutations';
	import { removeAdminLocation, setAdminLocation } from '$lib/mutations/user';
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
		refreshLocations,
		admin,
		newAdmins,
		adminsToRemove,
		showTeams,

		teamToEdit

	} from '$lib/superAdminStore';
	import { CachePolicy } from '$houdini';
	import { showAddLocation } from '$lib/locationStore';
	import AddUser from '$components/SuperAdminComponents/AddUser.svelte';
	import EditTeam from '$components/SuperAdminComponents/EditTeam.svelte';
	import TeamList from '$components/SuperAdminComponents/TeamList.svelte';

	/**
	 * updates the locationNames-list, which is used for checking whether a location name is already in use
	 */
	async function getLocationsFunction() {
		await getLocations.fetch({ policy: CachePolicy.NetworkOnly }).then(() => {
			$locationNames = [''];
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
		saveBuildingChanges($locationToEdit.id);

		if ($changedBuidings.size > 0) {
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
						saveAdminToLocation(value.data?.addLocation?.pk_locationid ?? '');
						saveBuildingChanges(value.data?.addLocation?.pklocationid);

						$isSaveDisabled = true;
						getLocationsFunction();
						$admin = { pk_userid: '', name: '' };
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
		console.log($newAdmins);

		$newAdmins.forEach(async (a) => {
			const result = await setAdminLocation
				.mutate({
					userid: a.pk_userid,
					locationid: locationid
				})
				.then((value) => {
					console.log(value);
					$newAdmins = [];
					$admin = { pk_userid: '', name: '' };
				});
		});
	}

	/**
	 * saves the buildings added
	 * @param locationid id of the location in which the building was added
	 */
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

	/**
	 * saves the changes made to an edited location
	 */
	async function saveEditLocationChanges() {
		console.log($locationNames);
		console.log('new name: ' + $locationToEdit.name);

		// if ($locationNames.includes($locationToEdit.name.toLowerCase())) {
		// 	alert('EDIT A location with this name already exists. Please enter a different name!');
		// } else {
		const result = await changeNameOfLocation
			.mutate({
				id: $locationToEdit.id,
				newName: $locationToEdit.name
			})
			.then((value) => {
				let adminIds = value.data?.changeNameOfLocation?.admins?.map((a) => a?.pk_userid);
				if (!adminIds?.includes($admin.pk_userid)) {
					saveAdminToLocation(value.data?.changeNameOfLocation?.pk_locationid ?? '');
				}
				if ($adminsToRemove) {
					removeAdmins(value.data?.changeNameOfLocation?.pk_locationid ?? '');
				}
			});
		console.log(result);
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
		$changedBuidings.forEach(async (building, id) => {
			const result = await changeNameOfBuilding.mutate({
				id,
				newName: building
			});
			console.log(result);
		});

		$changedBuidings = new Map();
		$isSaveDisabled = true;
	}

	/**
	 * saves the changes made to an edited floor
	 */
	async function saveEditFloorChanges() {
		console.log('floorsToEdit:' + $floorsToEdit);

		$floorsToEdit.forEach(async (floor, id) => {
			console.log('FLOOOOOOOR');
			console.log(id + ' name: ' + floor);

			const result = await changeNameOfFloor.mutate({
				id: id,
				newName: floor
			});

			console.log(result);
		});

		$floorsToEdit = new Map();
		$isSaveDisabled = true;
	}
</script>

<AddTeam />
<AddUser />

<AddLocation />
{#if $showAddLocation}
	<AddBuilding />
{/if}

{#if $locationToEdit.id !== ''}
	<EditLocation />
	{#if $buildingToEdit.id !== ''}
		<EditBuilding />
	{/if}
{/if}

{#if !$showTeams}
	<button class="btn variant-filled-primary" on:click={() => ($showTeams = true)}>Teams</button>
{:else}
	<TeamList />
	<button on:click={() => $showTeams = false}>Back</button>
	{#if $teamToEdit.pk_teamid !== ""}
		<EditTeam />
	{/if}
{/if}

<br />

<button disabled={$isSaveDisabled} class="btn variant-filled-primary" on:click={saveLocationChanges}
	>Save Changes</button
>

<LocationList />
