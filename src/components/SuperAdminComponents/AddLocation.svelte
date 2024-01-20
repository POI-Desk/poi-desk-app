<script lang="ts">
	import { addLocation } from '$lib/mutations/locationMutations';
	import { getLocations } from '$lib/queries/locationQueries';
	import { onMount } from 'svelte';
	import { locationid } from '$lib/locationStore';
	import { saveChangesClickable, saveChangesClicked } from '$lib/saveChangesStore';
	import { showAddLocation } from '$lib/locationStore';
	import { Key } from 'lucide-svelte';


	let newName: string = '';
	let locationNames: string[] = [];

	onMount(() => {
		getLocationsFunction();
		showAddLocation.set(false);
		

		const unsubscribe = saveChangesClicked.subscribe((value) => {
			handleSaveChanges(value);
		});
		return unsubscribe;
	});

	async function getLocationsFunction() {
		await getLocations.fetch().then(() => {
			let locations = $getLocations.data?.getAllLocations;

			for (let i = 0; i < locations?.length; i++) {
				locationNames.push(locations?.at(i)?.locationname.toLowerCase ?? '');
			}
		});
	}

	function handleSaveChanges(value: boolean) {
		if (value) {
			saveLocationChanges();
		}
		saveChangesClicked.set(false);
	}

	function onAddLocation() {
		showAddLocation.set(true);
	}

	function saveLocationChanges() {

		if (!newName) {
			alert('You have to enter a name before saving the location!');
		} else if (locationNames.includes(newName.toLowerCase())) {
			alert('A location with this name already exists. Please enter a different name!');
		} else {
			try {
				const result = addLocation.mutate({
					name: newName
				});
				locationid.set(result.data?.addLocation?.pk_locationid ?? '');
				saveChangesClickable.set(false);
				saveChangesClicked.set(true);
			} catch (error) {
				console.error('Error:', error);
			}
		}
	}

	function handleNameInput() {
		if (newName === '' || newName in locationNames) {
			saveChangesClickable.set(false);
		} else {
			saveChangesClickable.set(true);
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
