<script>

    import { getBookings } from "$lib/bookingStore";
    import { searchedUser } from "$lib/searchStore";

    let time = "";

</script>

{#await getBookings.fetch({ variables: { userid: $searchedUser.pk_userid ?? '' } })}
    <p>Loading...</p>
{:then bookings}
    {#each bookings.data?.getBookingsByUserid as booking}
        <div>
            <div class="grid grid-cols-4 grid-rows-4">
                <div class="col-span-1 row-span-4">Photo</div>
                <div class="col-span-3">{booking.date}</div>
                <div class="col-span-3">{booking.desk.floor.building.location.locationname}</div>
                <!-- <div>{booking.bookingnumber}</div> -->
                {#if booking.isafternoon && booking.ismorning}
                <div class="col-span-3">07:00 - 20:00</div>
                {:else if booking.isafternoon}
                    <div class="col-span-3">13:00 - 20:00</div>
                {:else if booking.ismorning}
                    <div class="col-span-3">07:00 - 13:00</div>
                {/if}
                <div>{booking.desk.floor.building.buildingname}</div>
                <div>{booking.desk.floor.floorname}</div>
                <div>{booking.desk.desknum}</div>
                
                
            </div>
        </div>
    {/each}
{/await}

