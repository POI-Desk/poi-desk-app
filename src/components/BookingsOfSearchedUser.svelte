<script>
    import { getBookingsOfUserAndTime } from "$lib/stores/bookingStore.js";
    import { searchedUser } from "$lib/stores/searchStore.js";
    import BookingCard from "$components/PersonalBookingComponents/BookingCard.svelte";
</script>


<div class="mt-4 gap-2">
    {#await getBookingsOfUserAndTime.fetch({ variables: { userid: $searchedUser.pk_userid ?? '', isCurrent: true } })}
        <p>Loading...</p>
    {:then bookings}
        {#if bookings.data?.getBookingsByUserAndCurrent?.length ?? 0 > 0}
            {#each bookings.data?.getBookingsByUserAndCurrent ?? [] as booking}
                <BookingCard
                  canEdit="{false}"
                  thisBooking={booking}
                />
            {/each}
        {:else}
            <p>Currently no Bookings</p>
        {/if}
    {/await}
</div>
