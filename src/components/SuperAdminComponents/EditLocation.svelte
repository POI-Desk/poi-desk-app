<script lang="ts">
	import { CachePolicy } from '$houdini';
	import { deleteBuilding } from '$lib/mutations/buildings';
	import { getBuildings } from '$lib/queries/buildingQueries';
	import { getAdminsOfLocation, getLocations } from '$lib/queries/locationQueries';
	import { onMount } from 'svelte';
	import {
		isSaveDisabled,
		locationNames,
		refreshLocations,
		locationToEdit,
		buildingToEdit,
		admin,
		admins,
		newAdmins,
		adminsToRemove,
		adminsOfLocation,
	} from '$lib/superAdminStore';
	import AddBuilding from './AddBuilding.svelte';
	import { getAdminUsers } from '$lib/queries/userQuerries';
	import type { User } from '$lib/types/userTypes';
	import AddAdminToLocation from './AddAdminToLocation.svelte';

	$: buildings = $getBuildings.data?.getBuildingsInLocation;

	$: locationIdToEdit = $locationToEdit.id;

	// let currentAdmins = $adminsOfLocation;

	// $: {
	// 	$adminsOfLocation;
	// 	console.log("curr " + currentAdmins);
	// 	console.log("new " + $adminsOfLocation);
		
	// 	if (currentAdmins.sort() !== $adminsOfLocation.sort()) {
	// 		$isSaveDisabled = false;
	// 	} 
	// }


	// async function getLocationsFunction() {
	// 	await getLocations.fetch({ policy: CachePolicy.NetworkOnly });
	// }

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


	async function onDeleteBuilding(id: string) {
		console.log(id);

		const result = await deleteBuilding.mutate({
			id: id
		});
		$refreshLocations = !$refreshLocations;
	}

	function handleNameInput() {
		if ($locationToEdit.name === '' || $locationNames.includes($locationToEdit.name)) {
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

<div>
	{#key $refreshLocations}
		<AddBuilding />

		{#await getBuildings.fetch( { variables: { locationid: locationIdToEdit }, policy: CachePolicy.NetworkOnly } )}
			<p>fetching buildings...</p>
		{:then fetched}
			{$locationToEdit.name}
			<input
				type="text"
				class="input"
				bind:value={$locationToEdit.name}
				on:input={handleNameInput}
			/>
			{#each buildings ?? [] as building}
				<div>
					<div class="variant-outline-primary">
						{building.buildingname}
						<button
							on:click={() => {
								$buildingToEdit = { id: building.pk_buildingid, name: building.buildingname };
							}}>Edit</button
						>
						<button on:click={() => onDeleteBuilding(building.pk_buildingid)}>Delete</button>
					</div>
					<br />
				</div>
			{/each}
		{/await}

		<h2>Admins of {$locationToEdit.name}</h2>

		{#if $adminsOfLocation}
			{#each $adminsOfLocation as admin}
				<button on:click={() => handleRemoveAdmin(admin)}>X</button>{admin.username}<br />
			{/each}
		{/if}

		<AddAdminToLocation />
	{/key}
</div>
