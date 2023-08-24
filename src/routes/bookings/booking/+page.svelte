<script lang="ts">
	import Booking from '$components/Booking.svelte';
	import Check from '$components/Check.svelte';
	import CrazyAnimation from '$components/CrazyAnimation.svelte';
	import type { PageData } from './$types';

	let date: Date = new Date();
	
	let showModal: boolean = false;
	let table: string = 'A11';
	let visible = false;
	
	function spinnnnn() {
		visible = true;
		setTimeout(() => {
			visible = false;
		}, 5000);
	};
	

	function toggleModal() {
		showModal = !showModal;
	};
	export let data: PageData;
</script>

<h1 class="text-5xl m-5">Booking</h1>

<h1 class="text-5xl m-5">
	Current Date: {date.toLocaleDateString('de-DE')}
</h1>

<h1 class="text-5xl m-5">
	Current Table: {table}
</h1>

<button class="btn btn-primary" on:click={toggleModal}> Book Table </button>

{#if showModal}
	<Booking {date} {table} on:close={toggleModal} on:play={spinnnnn} />
{/if}
{#if visible}
	<CrazyAnimation>
		<Check />
	</CrazyAnimation>

{/if}

<style>
</style>
