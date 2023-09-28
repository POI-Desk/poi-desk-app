<script lang="ts">
	import type { PageData } from './$houdini';
	import { location, chosenLocation } from '$lib/locationStore';
	import type { Location } from '$lib/types/locationType';

	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'component',
		// Pass the component registry key as a string:
		component: 'modalDefaultLocation',
	};

	export let data: PageData;
	$: ({ getAllLocations } = data);
	$: locations = $getAllLocations.data?.getAllLocations;
	$: $location = $chosenLocation;
</script>

<div class="grid place-items-center place-content-center space-y-6 h-screen">
	<h1 class="text-2xl">Choose Your Location:</h1>
	{#if locations}
		{#each locations as location}
			<button
				class="btn btn-block variant-filled-primary px-14"
				on:click={() => {
					$chosenLocation = {
						locationname: location?.locationname || '',
						pk_locationid: location?.pk_locationid || ''
					};
					modalStore.trigger(modal);
				}}
			>
				{location?.locationname}
			</button>
		{/each}
	{/if}
</div>
