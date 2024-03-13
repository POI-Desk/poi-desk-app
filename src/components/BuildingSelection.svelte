<script lang="ts">
	import { RadioGroup, RadioItem } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	const dispatcher = createEventDispatcher();

	export let buildingName: string;
	export let buildings: any;
</script>

<RadioGroup
	border="none"
	padding="py-2"
	active="variant-filled-primary"
	hover="hover:variant-soft-primary"
	background="none"
>
	<div
		class="absolute
		 h-11 bottom-28 md:bottom-11 left-1/2 z-[100] rounded-full -translate-x-1/2 bg-surface-50-900-token
    flex border-2 border-primary-300 shadow-around-10"
	>
		{#each buildings ?? [] as building}
			<RadioItem
				bind:group={buildingName}
				name="buildings"
				value={building?.buildingname ?? ''}
				class="flex items-center justify-center px-12"
				on:change={() => {
					buildingName = building.buildingname;
					dispatcher('change');
				}}
			>
				<p class="select-none font-semibold">
					{building.buildingname}
				</p>
			</RadioItem>
		{/each}
	</div>
</RadioGroup>
