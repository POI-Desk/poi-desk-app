<script lang="ts">
	import { graphql } from '$houdini';
	import { user } from '$lib/userStore';
	import { onMount } from 'svelte';
	import { buildingid } from '$lib/buildingStore';

	import {getFloors} from "$lib/queries/floorQueries";

	$: locationid = $user.location?.pk_locationid!;

	export const _getBuildingsInLocationVariables = () => {
		return { locationid };
	};

	const getBuildings = graphql(`
		query getBuildingsInLocation($locationid: ID!) @load {
			getBuildingsInLocation(locationid: $locationid) {
				pk_buildingid
				buildingname
			}
		}
	`);

	$: buildings = $getBuildings.data?.getBuildingsInLocation;

	onMount(() => {
		selectFirstBuilding();
	});

	async function selectFirstBuilding() {
		await getBuildings.fetch({ variables: { locationid } });

		if (buildings) {
			$buildingid = buildings[0]?.pk_buildingid || ''; // Set to the first building
		}
	}

	$: {
		if ($buildingid) {
			getFloors.fetch({ variables: { buildingid: $buildingid } });
		}
	}
</script>

<div class="btn-group btn-group-horizontal">
	{#await getBuildings.fetch({ variables: { locationid } })}
		<p>loading buildings...</p>
	{:then fetched}
		{#each fetched.data?.getBuildingsInLocation ?? [] as building}
			<button
				class="btn variant-filled-primary !mx-2"
				on:click={() => {
					$buildingid = building?.pk_buildingid ?? '';
				}}
			>
				{building?.buildingname}
			</button>
		{/each}
	{/await}
</div>