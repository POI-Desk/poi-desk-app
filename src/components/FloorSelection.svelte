<script lang="ts">
	import { floorid } from '$lib/floorStore';
	import { buildingid } from '$lib/buildingStore';
	import { getFloors } from '$lib/queries/floorQueries';
	import { getBuildings } from '$lib/queries/buildingQueries';
	import * as Tabs from '$lib/components/ui/tabs';

	$: floors = $getFloors.data?.getFloorsInBuilding;

	export let floorName: string;

	$: {
		if ($floorid) {
			floorName = floors?.find((floor) => floor.pk_floorid === $floorid)?.floorname ?? '';
		}
	}

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

<Tabs.Root class="w-min">
	<Tabs.List
		class="absolute {$getBuildings.fetching
			? 'min-h-[25%]'
			: ''} left-2 md:left-11 top-1/2 z-[100] -translate-y-1/2
    flex flex-col border-2 shadow-around-10 w-min h-min"
	>
		{#if $getFloors.fetching}
			<div />
		{:else}
			{#each floors ?? [] as floor}
				<Tabs.Trigger
					value={floor?.pk_floorid}
					on:click={() => {
						$floorid = floor.pk_floorid;
					}}
					class="flex items-center justify-center px-5 py-5"
				>
					<p class="select-none font-semibold">
						{floor.floorname}
					</p>
				</Tabs.Trigger>
			{/each}
		{/if}
	</Tabs.List>
</Tabs.Root>

<!-- <RadioGroup
	border="none"
	padding="px-2"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	background="none"
>
	<div
		class="absolute {$getBuildings.fetching
			? 'min-h-[25%]'
			: ''} w-11 left-2 md:left-11 top-1/2 z-[100] rounded-full -translate-y-1/2 bg-surface-50-900-token
    flex flex-col border-2 border-primary-300 shadow-around-10"
	>
		{#if $getBuildings.fetching}
			<div  />
		{:else}
			{#each floors ?? [] as floor}
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
			{/each}
		{/if}
	</div>
</RadioGroup> -->
