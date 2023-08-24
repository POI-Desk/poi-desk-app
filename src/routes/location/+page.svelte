<script lang="ts">
	import DefaultLocation from '$components/DefaultLocation.svelte';
	import type { PageData } from './$houdini';
	let chosenLocation: {pk_locationid: string | null, locationname: string | null};
	let showModal: boolean = false;

	function toggleModal() {
		showModal = !showModal;
	}

	export let data: PageData;
	$: ({ getAllLocations } = data);
	$: locations = $getAllLocations.data?.getAllLocations;
</script>

<div class="grid place-items-center place-content-center space-y-6 h-screen">
	<h1 class="text-2xl">Choose Your Location:</h1>
	{#if locations}
		{#each locations as location}
			<button
				class="btn btn-block btn-primary px-14"
				on:click={() => {
					chosenLocation = location ?? {pk_locationid: "", locationname: ""};
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
