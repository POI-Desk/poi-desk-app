<script lang="ts">
	import { createEventDispatcher } from 'svelte';

	export let buildings: any[];

	const dispatch = createEventDispatcher();

	const changeBuilding = (buildingID: string) => {
		dispatch('changeBuilding', buildingID);
	};
</script>

<div
	class="absolute w-1/5 h-11 bottom-11 left-1/2 z-[100] rounded-full -translate-x-1/2 bg-[#FAF8FC] border-2 border-[#CCC5B9] shadow-[0px_0px_75px_1px_rgba(0,0,0,0.1)] grid grid-cols-{buildings
		? buildings.length
		: 0} divide-x-2 divide-[#CCC5B9]"
>
	{#if buildings}
		{#each buildings as building}
			<button
				on:click={() => changeBuilding(building.pk_buildingid)}
				class="flex items-center justify-center"
			>
				<p class="select-none">{building.buildingname}</p>
			</button>
		{/each}
	{/if}
</div>
