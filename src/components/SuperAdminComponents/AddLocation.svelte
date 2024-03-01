<script lang="ts">
	import { v4 as uuidv4 } from 'uuid';
	import { getLocations } from '$lib/queries/locationQueries';
	import { getAdminUsers } from '$lib/queries/userQuerries';
	import { onMount } from 'svelte';
	import { showAddLocation } from '$lib/locationStore';
	import AddAdminToLocation from './AddAdminToLocation.svelte';
	import {
		isSaveDisabled,
		newLocation,
		locationNames,
		refreshLocations,
		locationToEdit,
		admins,
		admin,
		newAdmins,

		adminsOfLocation

	} from '$lib/superAdminStore';
	import { CachePolicy } from '$houdini';
	import type { User } from '$lib/types/userTypes';

	// let admin: User;
	// let admins: User[];

	onMount(() => {
		getLocationsFunction();
		getAdmins();
		showAddLocation.set(false);
	});

	async function getLocationsFunction() {
		$locationNames = [''];
		await getLocations.fetch({ policy: CachePolicy.NetworkOnly }).then(() => {
			let locations = $getLocations.data?.getAllLocations;

			for (let i = 0; i < locations?.length; i++) {
				$locationNames.push(locations?.at(i)?.locationname.toLowerCase() ?? '');
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
		$locationToEdit.id = '';
		showAddLocation.set(true);
		const newId = uuidv4();
		$newLocation.id = newId;
	}

	function handleNameInput() {
		if ($newLocation.name === '' || $locationNames.includes($newLocation.name)) {
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

<h1>Location</h1>
{#if !$showAddLocation}
	<button class="btn variant-filled-primary" on:click={onAddLocation}> + Add location</button>
{:else}
	<div>
		<AddAdminToLocation />

		<div class="input">
			<input
				type="text"
				placeholder="Enter a name"
				bind:value={$newLocation.name}
				on:input={handleNameInput}
			/>
			{$newLocation.name}
		</div>
	</div>

	{#each $newAdmins as newAdmin}
		<button on:click={() => handleRemoveAdmin(newAdmin)}>X</button>{newAdmin.username}<br>
	{/each}
{/if}
