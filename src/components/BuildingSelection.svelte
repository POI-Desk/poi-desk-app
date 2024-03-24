<script lang="ts">
	import { buildingid } from '$lib/buildingStore';
	import { getBuildings } from '$lib/queries/buildingQueries';

	import { getFloors } from '$lib/queries/floorQueries';

	import * as Tabs from '$lib/components/ui/tabs';


	export let buildingName: string;
	export let buildings: any;
</script>

<Tabs.Root>
	<Tabs.List
		class="absolute {$getFloors.fetching
			? 'min-w-[25%]'
			: ''} h-11 bottom-28 md:bottom-11 left-1/2 z-[100] -translate-x-1/2
    flex border-2 shadow-around-10"
	>
		{#if $getBuildings.fetching}
			<div />
		{:else}
			{#each buildings ?? [] as building}
				<Tabs.Trigger
					value={building?.pk_buildingid}
					on:click={() => {
						$buildingid = building.pk_buildingid;
					}}
					class="flex items-center justify-center px-12"
				>
					<p class="select-none font-semibold">
						{building.buildingname}
					</p>
				</Tabs.Trigger>
			{/each}
		{/if}
	</Tabs.List>
</Tabs.Root>
