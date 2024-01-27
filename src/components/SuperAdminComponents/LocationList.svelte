<script lang="ts">
	import { deleteLocation } from "$lib/mutations/locationMutations";
	import { getLocations } from "$lib/queries/locationQueries";
	import { onMount } from "svelte";

    let locations: [] = [];

    onMount(() => {
		getLocationsFunction();
	});

	async function getLocationsFunction() {
		await getLocations.fetch().then(() => {
			locations = $getLocations.data?.getAllLocations;
		});
	}

	async function onDeleteLocation(id: string) {
		const result = await deleteLocation.mutate({
				id: id
			});
	}
</script>

<div>
    {#each locations as location}
	<div>
		<div class="variant-outline-primary">
			{location.locationname}
			<button>Edit</button>
			<button on:click={() => onDeleteLocation(location.locationid)}>Delete</button>
		</div>
		<br>
	</div>
    {/each}
</div>