<script lang="ts">
	import { user } from '$lib/stores/userStore';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { floorid } from '$lib/stores/floorStore';
	import { buildingid } from '$lib/stores/buildingStore';
	import { getAllLocations } from '$lib/queries/floorQueries';


	$: getAllLocations.fetch();

	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'component',
		// Pass the component registry key as a string:
		component: 'modalDefaultLocation'
	};

	export let data;
	//$: ({ getAllLocations } = data);
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
