<script lang="ts">
	import { addOutlook } from '$lib/bookingStore';
	import Confirmation from './ModalContents/Confirmation.svelte';
	import Selection from './ModalContents/Selection.svelte';
	import { createEventDispatcher } from 'svelte';
	import { graphql, type Bookinginput } from '$houdini';
	import { interval } from '$lib/bookingStore';
	import { bookDesk } from '$lib/mutations/booking';

	const dispatch = createEventDispatcher();

	// this function is called when the user clicks on the "Book"/"Cancel" button
	// and closes the Modal by dispatching an event to the parent page setting the
	// variable showModal to false
	function closeModal() {
		dispatch('close');
	}

	function playAnimation() {
		dispatch('play');
	}

	let time: string = 'none';
	let modalConfirmVisible: boolean = false;
	export let desk: any = undefined; //get table from parent page
	export let date: Date = new Date(2022, 12, 2); // get date from parent page

	console.log(desk);
</script>

<!-- useless Modal Stuff -->
<!-- Modal is always set on true and gets spawned when clicking a table on the map -->
<!-- modalConfirmVisible is a check that blends in the confirm page when clicking on "confirmation" -->

<div class="modal" class:modal-open={true}>
	<div class="modal-box flex flex-col">
		{#if !modalConfirmVisible}
			<Selection {desk} {date} />
			<div class="modal-action">
				<button class="btn btn-error" on:click={closeModal}>Cancel</button>
				<button
					class="btn btn-primary modal-button"
					disabled={!$interval.afternoon && !$interval.morning}
					on:click={() => (modalConfirmVisible = true)}>Book</button
				>
			</div>
		{:else}
			<Confirmation {desk} {date} />
			<div class="modal-action">
				<button class="btn btn-error" on:click={() => (modalConfirmVisible = false)}>Back</button>
				<button
					class="btn btn-primary modal-button"
					on:click={() => {
						closeModal();
						playAnimation();
						bookDesk.mutate({
							booking: {
								date: date.toISOString().split('T')[0],
								ismorning: $interval.morning,
								isafternoon: $interval.afternoon,
								userid: '767fbcb6-6de7-4354-9020-00a30cc2e218', // TODO: get user id from auth
								deskid: desk.pk_deskid
							}
						});
					}}>Confirm</button
				>
			</div>
		{/if}

		<!-- TODO: send to server code missing and adding to Outlook? -->
		{#if $addOutlook}
			<p>Life is Roblox</p>
		{/if}
	</div>
</div>

<style>
</style>
