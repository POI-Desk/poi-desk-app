<script lang="ts">
	import { floorid } from '$lib/floorStore';
	import { buildingid } from '$lib/buildingStore';
	import { getDesks } from '$lib/queries/deskQueries';
	import { getFloors } from '$lib/queries/floorQueries';

	$: floors = $getFloors.data?.getFloorsInBuilding;

	async function selectFirstFloor() {
		await getFloors.fetch({ variables: { buildingid: $buildingid } });

		if (floors) {
			$floorid = floors[0]?.pk_floorid || ''; // Set to the first floor
		}
	}

	$: {
		if ($buildingid) selectFirstFloor();
	}
</script>

<div
	class="absolute w-11 h-1/4 left-11 top-1/2 z-[100] rounded-full -translate-y-1/2 bg-[#FAF8FC] border-2 border-[#CCC5B9] shadow-[0px_0px_75px_1px_rgba(0,0,0,0.1)] grid grid-rows-{floors?.length} divide-y-2 divide-[#CCC5B9]"
>
	{#if $getFloors.fetching}
		<div class="h-full rounded-full placeholder animate-pulse" />
	{:else}
		{#each floors ?? [] as floor}
			<button
				on:click={() => {
					$floorid = floor?.pk_floorid ?? '';
				}}
				class="flex items-center justify-center"
			>
				<p class="select-none">{floor?.floorname.split(' ')[0]}</p>
			</button>
		{/each}
	{/if}
</div>
