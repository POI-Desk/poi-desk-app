<script lang="ts">
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

</script>

<div>
    {#each locations as location}
		<div>
			{location.locationname}
		</div>
    {/each}
</div>