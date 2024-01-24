<script lang="ts">
	import { getLocations } from '$lib/queries/locationQueries';
	import { onMount } from 'svelte';
	import { showAddLocation } from '$lib/locationStore';
	import { isSaveDisabled, newLocationName, locationNames } from '$lib/superAdminStore';

	onMount(() => {
		getLocationsFunction();
		showAddLocation.set(false);
	});

	async function getLocationsFunction() {
		await getLocations.fetch().then(() => {
			let locations = $getLocations.data?.getAllLocations;

			for (let i = 0; i < locations?.length; i++) {
				$locationNames.push(locations?.at(i)?.locationname.toLowerCase() ?? '');
			}
		});
	}

	function onAddLocation() {
		showAddLocation.set(true);
	}


	function handleNameInput() {
		if ($newLocationName === '' || $locationNames.includes($newLocationName)) {
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
				bind:value={$newLocationName}
				on:input={handleNameInput}
			/>
			{$newLocationName}
		</div>
	</div>
{/if}

