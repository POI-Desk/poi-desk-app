<script lang="ts">
	import { CachePolicy } from '$houdini';
	import { deleteLocation } from '$lib/mutations/locationMutations';
	import { getLocations } from '$lib/queries/locationQueries';
	import { onMount } from 'svelte';
	import { refreshLocations, locationToEdit, buildingToEdit, locationNames } from '$lib/superAdminStore';

	$: locations = $getLocations?.data?.getAllLocations;

	onMount(() => {
		getLocationsFunction();
	});

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

	async function onDeleteLocation(id: string) {
		console.log(id);

		const result = await deleteLocation.mutate({
			id: id
		});
		$refreshLocations = !$refreshLocations;
		getLocationsFunction();
	}

	function compare(a, b) {
		const aName = a.locationname.toLowerCase();
		const bName = b.locationname.toLowerCase();

		if (aName < bName) {
			return -1;
		}
		if (aName > bName) {
			return 1;
		}
		return 0;
	}
</script>

<div>
	{#key $refreshLocations}
		{#await getLocations.fetch({ policy: CachePolicy.NetworkOnly })}
			<p>fetching locations...</p>
		{:then fetched}
			{#each locations.sort((a,b) => compare(a,b)) as location}
				<div>
					<div class="variant-outline-primary">
						{location.locationname}
						<button
							on:click={() => {
								$locationToEdit.id = location.pklocationid;
								$locationToEdit.name = location.locationname;
								$buildingToEdit.id = "";
							}}>Edit</button
						>
						<button on:click={() => onDeleteLocation(location.pklocationid)}>Delete</button>
					</div>
					<br />
				</div>
			{/each}
		{/await}
	{/key}
</div>
