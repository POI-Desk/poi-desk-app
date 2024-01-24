<script lang="ts">
	import { addLocation } from '$lib/mutations/locationMutations';
	import { getLocations } from '$lib/queries/locationQueries';
	import { onMount } from 'svelte';
	import { locationid } from '$lib/locationStore';
	import { showAddLocation } from '$lib/locationStore';

	let newName: string = '';
	let locationNames: string[] = [];
	let isSaveDisabled = true;

	onMount(() => {
		getLocationsFunction();
		showAddLocation.set(false);
	});

	async function getLocationsFunction() {
		await getLocations.fetch().then(() => {
			let locations = $getLocations.data?.getAllLocations;

			for (let i = 0; i < locations?.length; i++) {
				locationNames.push(locations?.at(i)?.locationname.toLowerCase() ?? '');
			}
		});
	}

	function onAddLocation() {
		showAddLocation.set(true);
	}

	async function saveLocationChanges() {
		if (!newName) {
			alert('You have to enter a name before saving the location!');
		} else if (locationNames.includes(newName.toLowerCase())) {
			alert('A location with this name already exists. Please enter a different name!');
		} else {
			const result = await addLocation.mutate({
				name: newName
			});
			$locationid = result.data?.addLocation?.pk_locationid ?? '';
			isSaveDisabled = true;
		}
	}

	function handleNameInput() {
		if (newName === '' || locationNames.includes(newName)) {
			isSaveDisabled = true;
		} else {
			isSaveDisabled = false;
		}
	}
</script>

{#if !$showAddLocation}
	<button on:click={onAddLocation}> + Add location</button>
{:else}
	<div>
		<div class="input">
			<input
				type="text"
				placeholder="Enter a name"
				bind:value={newName}
				on:input={handleNameInput}
			/>
			{newName}
		</div>
	</div>
{/if}

<button disabled={isSaveDisabled} class="btn variant-filled-primary" on:click={saveLocationChanges}
	>Save Changes disabled</button
>
