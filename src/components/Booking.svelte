<script lang="ts">
	import { addOutlook } from '$lib/bookingStore';
	import Selection from './ModalContents/Selection.svelte';
	import { createEventDispatcher } from 'svelte';
	import { interval } from '$lib/bookingStore';
	import { bookDesk } from '$lib/mutations/booking';
	import { user } from '$lib/userStore';
	import type { ModalSettings } from '@skeletonlabs/skeleton';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import Confirmation from './ModalContents/Confirmation.svelte';

	const modalStore = getModalStore();

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
	export let desk: any = undefined; //get desk from parent page
	export let date: Date = new Date(2022, 12, 2); // get date from parent page

	const modal: ModalSettings = {
		type: 'component',
		component: 'modalConfirmation'
	};
	let hasBookings: boolean = desk.bookings.length !== 0;
	let isBookedMorning: boolean = hasBookings && desk.bookings[0].ismorning || desk.bookings[1]?.ismorning;
	let isBookedAfternoon: boolean = hasBookings && desk.bookings[0].isafternoon || desk.bookings[1]?.isafternoon;
	let isFullDay: boolean = hasBookings && isBookedMorning && isBookedAfternoon;

	// console.log(desk)
</script>

<!-- useless Modal Stuff -->
<!-- Modal is always set on true and gets spawned when clicking a desk on the map -->
<!-- modalConfirmVisible is a check that blends in the confirm page when clicking on "confirmation" -->

<div class="modal" class:modal-open={true}>
	<div class="modal-box flex flex-col">
		{#if !modalConfirmVisible}
			<Selection {desk} {date} {hasBookings} {isBookedMorning} {isBookedAfternoon} {isFullDay}/>
			<div class="modal-action">
				<button class="btn variant-filled-error" on:click={closeModal}>Cancel</button>
				<button
					class="btn btn-primary modal-button"
					disabled={!$interval.afternoon && !$interval.morning || isFullDay}
					on:click={() => isFullDay ? null : (modalConfirmVisible = true)}>Book
				</button>
			</div>
		{:else}
			<Confirmation {desk} {date} />
			<div class="modal-action">
				<button class="btn variant-filled-error" on:click={() => (modalConfirmVisible = false)}
					>Back</button
				>
				<button
					class="btn variant-filled-primary modal-button"
					on:click={async () => {
						closeModal();
						playAnimation();
						await bookDesk.mutate({
							booking: {
								date: date.toISOString().split('T')[0],
								ismorning: $interval.morning,
								isafternoon: $interval.afternoon,
								userid: $user.pk_userid,
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
