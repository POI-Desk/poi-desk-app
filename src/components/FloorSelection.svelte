<script lang="ts">
	import { getBuildings } from '$lib/queries/buildingQueries';
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatcher = createEventDispatcher();

	export let floors: any;
	export let floorName: string;
</script>

<RadioGroup
	border="none"
	padding="px-2"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	background="none"
>
	<div
		class="absolute w-11 left-2 md:left-11 top-1/2 z-[100] rounded-full -translate-y-1/2 bg-surface-50-900-token
    flex flex-col border-2 border-primary-300 shadow-around-10"
	>
		{#each floors ?? [] as floor}
			<!--        <div class="flex justify-center items-center">-->
			<RadioItem
				bind:group={floorName}
				name="floors"
				value={floor?.floorname ?? ''}
				class="flex items-center justify-center"
				on:change={() => {
					floorName = floor.floorname;
					dispatcher('change');
				}}
			>
				<p class="select-none font-semibold py-12">
					{floor?.floorname.split(' ')[0]}
				</p>
			</RadioItem>
			<!--        </div>-->
		{/each}
	</div>
</RadioGroup>
