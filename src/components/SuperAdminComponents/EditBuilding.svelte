<script lang="ts">
	import { CachePolicy } from '$houdini';
	import { deleteFloor } from '$lib/mutations/floors';
	import { getFloors } from '$lib/queries/floorQueries';
	import { onMount } from 'svelte';
	import { refreshLocations, locationidToEdit, buildingidToEdit } from '$lib/superAdminStore';

	$: floors = $getFloors.data?.getFloorsInBuilding;

	// async function getLocationsFunction() {
	// 	await getLocations.fetch({ policy: CachePolicy.NetworkOnly });
	// }

	async function onDeleteFloor(id: string) {
		console.log(id);

		const result = await deleteFloor.mutate({
			id: id
		});
		$refreshLocations = !$refreshLocations;
	}
</script>

<div>
	{#key $refreshLocations}
		{#await getFloors.fetch({variables: {buildingid: $buildingidToEdit}, policy: CachePolicy.NetworkOnly })}
			<p>fetching floors...</p>
		{:then fetched}
			{#each floors as floor}
				<div>
					<div class="variant-outline-primary">
						{floor.floorname}
						<!-- <button on:click={() => ($buildingidToEdit = floor.pk_buildingid)}>Edit</button>  -->
						<button on:click={() => onDeleteFloor(floor.pk_floorid)}>Delete</button>
					</div>
					<br />
				</div>
			{/each}
		{/await}
	{/key}
</div>
