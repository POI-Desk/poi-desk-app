<script lang="ts">
	import DefaultLocation from '$components/DefaultLocation.svelte';
	import type { PageData } from './$houdini';
	import { location } from '$lib/locationStore';
	import type { Location } from '$lib/types/locationType';

	let chosenLocation: Location;
	let showModal: boolean = false;

	function toggleModal() {
		showModal = !showModal;
	}

	export let data: PageData;
	$: ({ getAllLocations } = data);
	$: locations = $getAllLocations.data?.getAllLocations;
	$: $location = chosenLocation;
</script>

<div class="grid place-items-center place-content-center space-y-6 h-screen">
	<h1 class="text-2xl">Choose Your Location:</h1>
	{#if locations}
		{#each locations as location}
			<button
				class="btn btn-block btn-primary px-14"
				on:click={() => {
					chosenLocation = {locationname: location?.locationname || "" ,pk_locationid: location?.pk_locationid || "" };
					toggleModal();
				}}
			>
					{location?.locationname}
			</button>
		{/each}
	{/if}
	{#if showModal}
		<DefaultLocation {chosenLocation} on:close={toggleModal} />
	{/if}
</div>
