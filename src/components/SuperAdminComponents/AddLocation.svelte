<script lang="ts">
	import {v4 as uuidv4} from 'uuid';
	import { getLocations } from '$lib/queries/locationQueries';
	import { onMount } from 'svelte';
	import { showAddLocation } from '$lib/locationStore';
	import { isSaveDisabled, newLocation, locationNames, refreshLocations, locationToEdit } from '$lib/superAdminStore';
	import { CachePolicy } from '$houdini';


	onMount(() => {
		getLocationsFunction();
		showAddLocation.set(false);
	});

	async function getLocationsFunction() {
		$locationNames = [""];
		await getLocations.fetch({ policy: CachePolicy.NetworkOnly }).then(() => {
			let locations = $getLocations.data?.getAllLocations;

			for (let i = 0; i < locations?.length; i++) {
				$locationNames.push(locations?.at(i)?.locationname.toLowerCase() ?? '');
			}
		});
	}



	function onAddLocation() {
		$locationToEdit.id = "";
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

</script>

<h1>Location</h1>
{#if !$showAddLocation}
	<button class="btn variant-filled-primary"
	on:click={onAddLocation}> + Add location</button>
{:else}
	<div>
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
{/if}

