<script lang="ts">
	import { ProgressBar } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	export let floors: any[];

	const dispatch = createEventDispatcher();

	const changeFloor = (buildingID: string) => {
		dispatch('changeFloor', buildingID);
	};
</script>

<div
	class="absolute w-11 h-1/4 left-11 top-1/2 z-[100] rounded-full -translate-y-1/2 bg-[#FAF8FC] border-2 border-[#CCC5B9] shadow-[0px_0px_75px_1px_rgba(0,0,0,0.1)] grid grid-rows-{floors.length} divide-y-2 divide-[#CCC5B9]"
>
	{#if floors.length > 0}
		{#each floors as floor}
			<button
				on:click={() => changeFloor(floor.pk_floorid)}
				class="flex items-center justify-center"
			>
				<p class="select-none">{floor.floorname}</p>
			</button>
		{/each}
	{:else}
		<div class="h-full rounded-full placeholder animate-pulse" />
	{/if}
</div>
