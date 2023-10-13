<script lang="ts">
	import { floorid } from '$lib/floorStore';
	import { buildingid } from '$lib/buildingStore';

    import {getDesks} from "$lib/queries/deskQueries";
	import {getFloors} from "$lib/queries/floorQueries";

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

	$: {
		if ($floorid) {
			getDesks.fetch({ variables: { floorid: $floorid } });
		}
	}
</script>

<div class="flex items-center">
	<div class="btn-group btn-group-vertical">
		{#await getFloors.fetch({ variables: { buildingid: $buildingid } })}
			<p>loading seats...</p>
		{:then fetched}
			{#each fetched.data?.getFloorsInBuilding ?? [] as floor}
				<button
					class="btn variant-filled-primary"
					on:click={() => {
						$floorid = floor?.pk_floorid ?? '';
					}}>{floor?.floorname}</button
				>
			{/each}
		{/await}
	</div>
</div>
