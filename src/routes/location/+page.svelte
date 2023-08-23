<script lang="ts">
	import DefaultLocation from '$components/DefaultLocation.svelte';
	let locations: string[] = ['Wien', 'Salzburg', 'Hagenberg'];
	//api call to server
	let chosenLocation: string;
	let showModal: boolean = false;

	function toggleModal(){
		showModal = !showModal;
	}
</script>

<div class="grid pla ce-items-center place-content-center space-y-6 h-screen">
	<h1 class="text-2xl">Choose Your Location:</h1>
	{#each locations as location}
		<button
			class="btn btn-block btn-primary px-14"
			on:click={() => {
				chosenLocation = location;
				toggleModal();
			}}
		>
			<a href="/location/defaultLocation">
				{location}
			</a>
		</button>
	{/each}
	{#if showModal}
		<DefaultLocation {chosenLocation} on:close={toggleModal}  />
	{/if}
</div>
