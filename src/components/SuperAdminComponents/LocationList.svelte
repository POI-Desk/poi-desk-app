<script lang="ts">
	import { CachePolicy } from "$houdini";
	import { deleteLocation } from "$lib/mutations/locationMutations";
	import { getLocations } from "$lib/queries/locationQueries";
	import { onMount } from "svelte";
	import { refreshLocations, locationidToEdit } from "$lib/superAdminStore";

	$: locations = $getLocations?.data?.getAllLocations;


    onMount(() => {
		getLocationsFunction();
	});

	async function getLocationsFunction() {
		await getLocations.fetch({ policy: CachePolicy.NetworkOnly });
		
		
	}

	async function onDeleteLocation(id: string) {
		console.log(id);
		
		const result = await deleteLocation.mutate({
			id: id
		});
		$refreshLocations = !$refreshLocations;
	}
</script>

<div>
	{#key $refreshLocations}
		{#await getLocations.fetch({ policy: CachePolicy.NetworkOnly })}
			<p>fetching locations...</p>
		{:then fetched} 
			{#each locations as location}
			<div>
				<div class="variant-outline-primary">
					{location.locationname}
					<button on:click={() => $locationidToEdit = location.pklocationid}>Edit</button>
					<button on:click={() => onDeleteLocation(location.pklocationid)}>Delete</button>
				</div>
				<br>
			</div>
			{/each}
		{/await}
	{/key}

    
</div>