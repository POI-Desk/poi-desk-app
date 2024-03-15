<script lang="ts">
	// TODO: BITTE KEINE PAGE SONDERN MODAL @LEOPOLD
	import type { PageData } from './$houdini';
	import { user } from '$lib/userStore';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { floorid } from '$lib/floorStore';
	import { buildingid } from '$lib/buildingStore';
	import { graphql } from '$houdini';

	// export const _getAllLocationsVariables = () => {
	// 	return {};
	// };
	export let data: PageData;

	const getAllLocationsPage = graphql(`
		query getAllLocations @load {
			getAllLocations {
				pk_locationid
				locationname
			}
		}
	`);

	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'component',
		// Pass the component registry key as a string:
		component: 'modalDefaultLocation'
	};

	$: ({ getAllLocations } = data);
	$: locations = $getAllLocations.data?.getAllLocations;
</script>

<div class="grid place-items-center place-content-center space-y-6 h-screen">
	<h1 class="text-2xl">Choose Your Location:</h1>
	{#if locations}
		{#each locations as location}
			<button
				class="btn btn-block variant-filled-primary w-2/3 px-14"
				on:click={() => {
					$user.location = {
						locationname: location?.locationname,
						pk_locationid: location?.pk_locationid
					};
					modalStore.trigger(modal);
					$floorid = '';
					$buildingid = '';
				}}
			>
				{location?.locationname}
			</button>
		{/each}
	{/if}
</div>
