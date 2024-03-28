<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { Button } from '$lib/components/ui/button';

	export let buildings: any[];

	const dispatch = createEventDispatcher();

	const changeBuilding = (buildingID: string) => {
		dispatch('changeBuilding', buildingID);
	};
</script>

<div
	class="absolute w-1/5 h-11 bottom-11 left-1/2 z-[100] rounded-full -translate-x-1/2 bg-surface-50 border-2 border-primary-300 shadow-around-10 grid grid-cols-{buildings.length} divide-x-2 divide-primary-300"
>
	{#if buildings.length > 0}
		{#each buildings as building}
			<Button
				on:click={() => changeBuilding(building.pk_buildingid)}
				class="flex items-center justify-center"
			>
				<p class="select-none text-primary-500 font-semibold">{building.buildingname}</p>
			</Button>
		{/each}
	{:else}
		<div class="h-full rounded-full placeholder animate-pulse" />
	{/if}
</div>
