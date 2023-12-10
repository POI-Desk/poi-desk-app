<script lang="ts">
    import {getModalStore} from '@skeletonlabs/skeleton';
    import {interval, selectedDesk, displayedTime} from '$lib/bookingStore';
    import {dateValue} from '$lib/dateStore';
    import {bookDesk} from '$lib/mutations/booking';
    import {user} from '$lib/userStore';
    import BookingDeskState from '$components/SetBookingComponents/BookingDeskState.svelte';

    //icons
    import {
        Calendar,
        Clock,
        MapPin,
        Building,
        Armchair,
        Cuboid,
        ArrowBigLeft,
        ArrowBigRight,
        X,
        Undo2,
        User
    } from 'lucide-svelte';
    import {refreshDesks} from '$lib/refreshStore';
    import {selectedDesks, selectedUsers} from "$lib/stores/extendedUserStore";


    async function finishBooking() {
        console.log("finishing booking")
        for (const desk of $selectedDesks) {
            const i = $selectedDesks.indexOf(desk);
            const value = await bookDesk.mutate({
                booking: {
                    date: $dateValue,
                    ismorning: $interval.morning,
                    isafternoon: $interval.afternoon,
                    userid: $selectedUsers[i].pk_userid,
                    deskid: desk.pk_deskid
                }
            });
            console.log(value)
        }
        $selectedDesks = [];
        $refreshDesks = !$refreshDesks;
        modalStore.close();
    }

    function onExitHandler() {
        modalStore.close();
        $dateValue = new Date().toISOString().split('T')[0];
    }

    let date: Date = new Date($dateValue);

    let selectionPage: boolean = true;

    // let currentBookingsOnDate = $selectedDesk.bookings.filter((b: any) => b.date === $dateValue);
    //
    // let hasBookings: boolean = currentBookingsOnDate.length > 0;
    //
    // let isBookedMorning: boolean =
    //     ((hasBookings && currentBookingsOnDate[0].ismorning) || currentBookingsOnDate[1]?.ismorning) ??
    //     false;
    //
    // let isBookedAfternoon: boolean =
    //     ((hasBookings && currentBookingsOnDate[0].isafternoon) ||
    //         currentBookingsOnDate[1]?.isafternoon) ??
    //     false;
    //
    // let isFullDay: boolean = hasBookings && isBookedMorning && isBookedAfternoon;

    const modalStore = getModalStore();

    const cBase = 'card p-4 shadow-xl space-y-4';

    let currentPage = "start";

    function whenSelection() {
        // if (!isFullDay) {
        //     if (!$interval.morning && !$interval.afternoon) {
        //         return;
        //     }
        //     selectionPage = !selectionPage;
        //     return;
        // }
    }

    function addDay() {
        let date = new Date($dateValue);
        date.setDate(date.getDate() + 1);
        $dateValue = date.toISOString().split('T')[0]; // format back to 'yyyy-mm-dd'
    }

    function subtractDay() {
        let date = new Date($dateValue);
        date.setDate(date.getDate() - 1);
        $dateValue = date.toISOString().split('T')[0]; // format back to 'yyyy-mm-dd'
    }

    window.addEventListener('popstate', () => {
        modalStore.close();
    });
</script>

{#if $modalStore[0]}
    <div class="{cBase} rounded-xl w-screen h-screen flex flex-col bg-slate-200">
        <div class="grid grid-cols-3 items-center">
            <div>
                {#if (currentPage !== "start")}
                    <button
                            on:click={() => {currentPage = "start"}}
                            class="text-black px-4 py-2 rounded-full"
                    >
                        <Undo2/>
                    </button>
                {/if}
            </div>
            <h1 class="text-center text-3xl p-3">Booking</h1>
            <button
                    on:click={() => onExitHandler()}
                    class="text-black px-4 py-2 rounded-full flex justify-end"
            >
                <X/>
            </button>
        </div>

        <div class="h-full flex items-center justify-center">
            <div class="grid grid-cols-3 grid-rows-6 gap-7">
                {#if (currentPage === "start")}
                    <div class="rounded-3xl flex justify-center bg-white">
                        <div class="rounded-3xl m-3 mx-5">
                            <Calendar/>
                        </div>
                    </div>
                    <div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
                        {date.toLocaleDateString('de-DE')}
                    </div>
                    <div class="rounded-3xl flex justify-center bg-white">
                        <div class="rounded-3xl m-3 mx-5">
                            <Clock/>
                        </div>
                    </div>
                    <div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
                        {#if ($interval.morning)}
                            <div>07:00-12:00</div>
                        {:else}
                            <div>13:00-20:00</div>
                        {/if}
                    </div>
                    <div class="rounded-3xl flex justify-center bg-white">
                        <div class="rounded-3xl m-3 mx-5">
                            <MapPin/>
                        </div>
                    </div>
                    <div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
                        {$user.location?.locationname}
                    </div>
                    <div class="rounded-3xl flex justify-center bg-white">
                        <div class="rounded-3xl m-3 mx-5">
                            <Building/>
                        </div>
                    </div>
                    <div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
                        <!-- TODO Desk Type fixen -->
                        {$selectedDesks[0].floor.building.buildingname}
                    </div>
                    <div class="rounded-3xl flex justify-center bg-white">
                        <div class="rounded-3xl m-3 mx-5">
                            <Cuboid/>
                        </div>
                    </div>
                    <div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
                        {$selectedDesks[0].floor.floorname}
                    </div>
                    <div class="rounded-3xl flex justify-center bg-white">
                        <div class="rounded-3xl m-3 mx-5">
                            <Armchair/>
                        </div>
                    </div>
                    <button class="col-span-2 rounded-3xl flex justify-center items-center text-xl variant-filled-primary"
                            on:click={() => {currentPage = "desks"}}
                    >
                        Show Desks
                    </button>
                    <!-- TODO change icons and text -->
                    <div class="rounded-3xl flex justify-center bg-white">
                        <div class="rounded-3xl m-3 mx-5">
                            <User/>
                        </div>
                    </div>
                    <button class="col-span-2 rounded-3xl flex justify-center items-center text-xl variant-filled-primary"
                            on:click={() => {currentPage = "users"}}
                    >
                        Show Users
                    </button>
                {:else if (currentPage === "desks")}
                    {#each $selectedDesks as desk}
                        <div class="rounded-3xl flex justify-center bg-white">
                            <div class="rounded-3xl m-3 mx-5">
                                <Armchair/>
                            </div>
                        </div>
                        <div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
                            {desk.desknum}
                        </div>
                    {/each}
                {:else if (currentPage === "users")}
                    {#each $selectedUsers as user}
                        <!-- TODO change icons and text -->
                        <div class="rounded-3xl flex justify-center bg-white">
                            <div class="rounded-3xl m-3 mx-5">
                                <User/>
                            </div>
                        </div>
                        <div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
                            {user.username}
                        </div>
                    {/each}
                {/if}
            </div>
        </div>

        <div class="bg-white h-24 rounded-full">
            <button on:click={() => finishBooking()}
                    class="btn rounded-full w-full h-full text-xl variant-filled-primary"
            >Buchen
            </button
            >
        </div>
    </div>
{/if}
