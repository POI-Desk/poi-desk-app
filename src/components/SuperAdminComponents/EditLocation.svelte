<script lang="ts">
	import { CachePolicy } from '$houdini';
	import { deleteBuilding } from '$lib/mutations/buildings';
	import { getBuildings } from '$lib/queries/buildingQueries';
	import { onMount } from 'svelte';
	import { refreshLocations, locationidToEdit, buildingidToEdit } from '$lib/superAdminStore';

	$: buildings = $getBuildings.data?.getBuildingsInLocation;

	// async function getLocationsFunction() {
	// 	await getLocations.fetch({ policy: CachePolicy.NetworkOnly });
	// }

	async function onDeleteBuilding(id: string) {
		console.log(id);

		const result = await deleteBuilding.mutate({
			id: id
		});
		$refreshLocations = !$refreshLocations;
	}
</script>

<div>
	{#key $refreshLocations}
		{#await getBuildings.fetch({variables: {locationid: $locationidToEdit}, policy: CachePolicy.NetworkOnly })}
			<p>fetching buildings...</p>
		{:then fetched}
			{#each buildings as building}
				<div>
					<div class="variant-outline-primary">
						{building.buildingname}
						<button on:click={() => ($buildingidToEdit = building.pk_buildingid)}>Edit</button> 
						<button on:click={() => onDeleteBuilding(building.pk_buildingid)}>Delete</button>
					</div>
					<br />
				</div>
			{/each}
		{/await}
	{/key}
</div>
