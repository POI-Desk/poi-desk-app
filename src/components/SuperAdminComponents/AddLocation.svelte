<script lang="ts">
	import { addLocation } from '$lib/mutations/locationMutation';
	import { getLocations } from '$lib/queries/locationQueries';
	import { onMount } from 'svelte';
	import { locationid } from '$lib/locationStore';
	import { saveChangesClickable, saveChangesClicked } from '$lib/saveChangesStore';
	import { Key } from 'lucide-svelte';

	let showAddLocation: boolean = false;
	let newName: string = '';
	let locationNames: string[] = [];

	onMount(() => {
		getLocationsFunction();

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
		showAddLocation = true;
	}

	function saveLocationChanges() {
		console.log(
			'new name would be: ' +
				newName +
				', newName in locations: ' +
				(newName == locationNames.at(3))
		);
		console.log('locationnames: ' + locationNames);

		if (!newName) {
			alert('You have to enter a name before saving the building!');
		} else if (locationNames.includes(newName.toLowerCase)) {
			alert('A building with this name already exists. Please enter a different name!');
		} else {
			console.log('in else... whyever');

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

{#if !showAddLocation}
	<button on:click={onAddLocation}> + Add location</button>
{:else}
	<button disabled on:click={onAddLocation}> + Add location</button>
	{showAddLocation}
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
		<div>
			<h2>Buildings</h2>
			<p>Placeholder for building add</p>
		</div>
		<div>
			<h2>Thumbnail</h2>
			<p>placeholder for file upload</p>
		</div>
		<br />
		<div />
	</div>
{/if}
