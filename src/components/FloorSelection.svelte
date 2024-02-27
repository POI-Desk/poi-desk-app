<script lang="ts">
	import { floorid } from '$lib/floorStore';
	import { buildingid } from '$lib/buildingStore';
	import { getFloors } from '$lib/queries/floorQueries';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { getBookings } from '$lib/bookingStore';
	import { getBuildings } from '$lib/queries/buildingQueries';

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

<RadioGroup
	border="none"
	padding="px-2"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	background="none"
>
	<div
		class="absolute {$getBuildings.fetching
			? 'min-h-[25%]'
			: ''} w-11 left-2 lg:left-11 top-1/2 z-[100] rounded-full -translate-y-1/2 bg-surface-50-900-token
    flex flex-col border-2 border-primary-300 shadow-around-10"
	>
		{#if $getBuildings.fetching}
			<div  />
		{:else}
			{#each floors ?? [] as floor}
				<!--        <div class="flex justify-center items-center">-->
				<RadioItem
					bind:group={$floorid}
					name="floors"
					value={floor?.pk_floorid ?? ''}
					class="flex items-center justify-center"
				>
					<p class="select-none font-semibold py-12">
						{floor?.floorname.split(' ')[0]}
					</p>
				</RadioItem>
				<!--        </div>-->
			{/each}
		{/if}
	</div>
</RadioGroup>
