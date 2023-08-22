<script lang="ts">
	import Booking from '$components/Booking.svelte';
	let date: Date = new Date();
	let showModal: boolean = false;
    let table: string = 'A11';

	function toggleModal() {
		showModal = !showModal;
	}
</script>

<h1 class="text-5xl m-5">Booking</h1>

<h1 class="text-5xl m-5">
	Current Date: {date.toLocaleDateString()}
</h1>

<h1 class="text-5xl m-5">
	Current Table: {table}
</h1>

<button class="btn btn-primary" on:click={toggleModal}> Book Table </button>

{#if showModal}
	<Booking {date} {table} on:close={toggleModal} />
{/if}

<style>
</style>
