<script>
    import { getBookings } from "$lib/bookingStore";
    import { searchedUser } from "$lib/searchStore";
    import { MapPin,Clock10,Building,Building2,MonitorSmartphone } from 'lucide-svelte';
</script>


<div class="mt-4 gap-2">
    {#await getBookings.fetch({ variables: { userid: $searchedUser.pk_userid ?? '' } })}
        <p>Loading...</p>
    {:then bookings}
        {#if bookings.data?.getBookingsByUserid?.length ?? 0 > 0}
            {#each bookings.data?.getBookingsByUserid ?? [] as booking}
            <div class="flex flex-row justify-between border mt-1 rounded-xl ml-2 mr-2 p-2" style="background-color: #d4d6d9;">
                <div class="self-center w-1/2">
                    <img src="/locationImages/{booking.desk?.floor?.building?.location?.locationname}.png" alt="wien">
                </div>
                <div class="grid grid-cols-3 grid-rows-4 gap-1 px-2 w-full" >
                    <div class="col-span-3">{booking.date}</div>
                    <div class="col-span-3">
                        <div class="flex items-center">
                            <MapPin size=18 />
                            <span class="ml-2">{booking.desk?.floor?.building?.location?.locationname}</span>
                        </div>                    
                    </div>
                    
                        <div class="col-span-3">
                            <div class="flex items-center">
                                <Clock10 size=18/>
                                {#if booking.isafternoon && booking.ismorning}
                                <span class="ml-2">07:00 - 20:00</span>
                                {:else if booking.isafternoon}
                                <span class="ml-2">13:00 - 20:00</span>
                                {:else if booking.ismorning}
                                <span class="ml-2">07:00 - 13:00</span>
                                {/if}
                            </div>
                        </div>
                    <div>
                        <div class="flex items-center">
                            <Building2 size=18/>
                            <span class="ml-2">{booking.desk?.floor?.building.buildingname.split(' ')[1]}</span>
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center">
                            <Building size=18/>
                            <span class="ml-2">{booking.desk?.floor?.floorname.charAt(0)}</span>
                        </div>
                    </div>
                    <div>
                        <div class="flex items-center">
                            <MonitorSmartphone size=18/>
                            <span class="ml-2">{booking.desk?.desknum}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/each}
        {:else}
            <p>Currently no Bookings</p>
        {/if}
        
    {/await}
</div>
