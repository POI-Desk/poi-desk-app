<script lang="ts">
    import { addOutlook } from '$lib/bookingStore';
    import Confirmation from './ModalContents/Confirmation.svelte';
    import Selection from './ModalContents/Selection.svelte';
    import { createEventDispatcher } from 'svelte';
    import { graphql } from '$houdini';
    import { interval } from '$lib/bookingStore';
    import { user } from '$lib/userStore'

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

    const bookSeat = graphql(`
		mutation bookSeat(
			$date: String!
			$isMorning: Boolean!
			$isAfternoon: Boolean!
			$userId: String!
			$seatId: String!
		) {
			bookSeat(
				date: $date
				isMorning: $isMorning
				isAfternoon: $isAfternoon
				userId: $userId
				seatId: $seatId
			) {
				bookingnumber
			}
		}
	`);

    let time: string = 'none';
    let modalConfirmVisible: boolean = false;
    export let seat: any = undefined; //get table from parent page
    export let date: Date = new Date(2022, 12, 2); // get date from parent page

    console.log(seat);
</script>

<!-- useless Modal Stuff -->
<!-- Modal is always set on true and gets spawned when clicking a table on the map -->
<!-- modalConfirmVisible is a check that blends in the confirm page when clicking on "confirmation" -->

<div class="modal" class:modal-open={true}>
    <div class="modal-box flex flex-col">
        {#if !modalConfirmVisible}
            <Selection {seat} {date} />
            <div class="modal-action">
                <button class="btn btn-error" on:click={closeModal}>Cancel</button>
                <button class="btn btn-primary modal-button" disabled={!$interval.afternoon && !$interval.morning} on:click={() => (modalConfirmVisible = true)}
                >Book</button
                >
            </div>
        {:else}
            <Confirmation {seat} {date} />
            <div class="modal-action">
                <button class="btn btn-error" on:click={() => (modalConfirmVisible = false)}>Back</button>
                <button
                        class="btn btn-primary modal-button"
                        on:click={() => {
						closeModal();
						playAnimation();
						bookSeat.mutate({
							date: date.toISOString().split('T')[0],
							isMorning: $interval.morning,
							isAfternoon: $interval.afternoon,
							userId: $user.pk_userId,
							seatId: seat.pk_seatid
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