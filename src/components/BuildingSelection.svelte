<script lang="ts">
	import { graphql } from '$houdini';
	import { user } from '$lib/userStore';
	import { onMount } from 'svelte';
	import { buildingid } from '$lib/buildingStore';
	import { getBuildings } from '$lib/queries/buildingQueries';

	import { getFloors } from '$lib/queries/floorQueries';

	$: locationid = $user.location?.pk_locationid!;

	$: buildings = $getBuildings.data?.getBuildingsInLocation;

	async function selectFirstBuilding() {
		if (!locationid) return;
		await getBuildings.fetch({ variables: { locationid } });

		if (buildings) {
			$buildingid = buildings[0]?.pk_buildingid || ''; // Set to the first building
		}
	}

	$: if (locationid) selectFirstBuilding();
	$: {
		if ($buildingid) {
			getFloors.fetch({ variables: { buildingid: $buildingid } });
		}
	}
</script>

<div
	class="absolute md:w-2/5 xl:w-1/5 w-3/5 h-11 bottom-11 left-1/2 z-[100] rounded-full -translate-x-1/2 bg-surface-50 border-2 border-primary-300 shadow-around-10 grid grid-cols-{buildings?.length ??
		1} divide-x-2 divide-primary-300"
>
	{#if $getBuildings.fetching}
		<div class="h-full rounded-full placeholder animate-pulse" />
	{:else}
		{#each buildings ?? [] as building}
			<button
				on:click={() => {
					$buildingid = building?.pk_buildingid;
				}}
				class="flex items-center justify-center"
			>
				<p class="select-none text-primary-500 font-semibold">
					{building.buildingname}
				</p>
			</button>
		{/each}
	{/if}
</div>
