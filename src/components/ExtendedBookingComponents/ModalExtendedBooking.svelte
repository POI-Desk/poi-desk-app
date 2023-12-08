<script lang="ts">
    import { getModalStore } from '@skeletonlabs/skeleton';
    import { interval, selectedDesk, displayedTime } from '$lib/bookingStore';
    import { dateValue } from '$lib/dateStore';
    import { bookDesk } from '$lib/mutations/booking';
    import { user } from '$lib/userStore';
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
        X
    } from 'lucide-svelte';
    import { refreshDesks } from '$lib/refreshStore';
    import {selectedDesks, selectedUsers} from "$lib/stores/extendedUserStore";

    $interval.morning = false;
    $interval.afternoon = false;


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

        <p>worry thou not 'tis but a test</p>

        {#if selectionPage}
            <div class="flex justify-center items-center">
                <div class="flex items-center gap-x-5 bg-white rounded-full p-4 px-10">
                    <!--
                    <button>
                        <ArrowBigLeft />
                    </button>-->
<!--                    <h1>{$selectedDesk.desknum}</h1>-->
                    <!--
                    <button>
                        <ArrowBigRight />
                    </button>-->
                </div>
                <button
                        on:click={() => onExitHandler()}
                        class="absolute right-11 text-black px-4 py-2 rounded-full"
                >
                    <X />
                </button>
            </div>
            <div class="grid grid-cols-7 gap-4 text-center basis-full">
<!--                <BookingDeskState shownInterval="morning" />-->
<!--                &lt;!&ndash;&ndash;&gt;-->
<!--                <BookingDeskState shownInterval="afternoon" />-->
            </div>

            <b>Desks:</b>
                {#each $selectedDesks as desk}
                    {desk.desknum},
                {/each}
            <b>Users:</b>
                ACHTUNG NOCH STATISCH:
                {#each $selectedUsers as user}
                    {user.username},
                {/each}

            <div class="bg-white h-24 rounded-full flex items-center justify-between px-10">
                <button on:click={subtractDay}>
                    <ArrowBigLeft />
                </button>
                <h1>{$dateValue}</h1>
                <button on:click={addDay}>
                    <ArrowBigRight />
                </button>
            </div>
            <div class="bg-white h-24 rounded-full">
                <button on:click={() => finishBooking()} class="btn rounded-full w-full h-full text-xl"
                >Buchen</button
                >
            </div>
        {:else}
            <h1 class="text-center text-3xl p-3">Buchung</h1>
            <div class="h-full flex items-center justify-center">
                <div class="grid grid-cols-3 grid-rows-6 gap-7">
                    <div class="rounded-3xl flex justify-center bg-white">
                        <div class="rounded-3xl m-3 mx-5">
                            <Calendar />
                        </div>
                    </div>
                    <div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
                        {date.toLocaleDateString('de-DE')}
                    </div>
                    <div class="rounded-3xl flex justify-center bg-white">
                        <div class="rounded-3xl m-3 mx-5">
                            <Clock />
                        </div>
                    </div>
                    <div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
                        {$displayedTime}
                    </div>
                    <div class="rounded-3xl flex justify-center bg-white">
                        <div class="rounded-3xl m-3 mx-5">
                            <MapPin />
                        </div>
                    </div>
                    <div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
                        <!--{$user.location?.locationname}-->
                    </div>
                    <div class="rounded-3xl flex justify-center bg-white">
                        <div class="rounded-3xl m-3 mx-5">
                            <Building />
                        </div>
                    </div>
                    <div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
                        <!--{$selectedDesk.floor.building.buildingname}-->
                    </div>
                    <div class="rounded-3xl flex justify-center bg-white">
                        <div class="rounded-3xl m-3 mx-5">
                            <Cuboid />
                        </div>
                    </div>
                    <div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
                        <!--{$selectedDesk.floor.floorname}-->
                    </div>
                    <div class="rounded-3xl flex justify-center bg-white">
                        <div class="rounded-3xl m-3 mx-5">
                            <Armchair />
                        </div>
                    </div>
                    <div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
                        <!--{$selectedDesk.desknum}-->
                    </div>
                </div>
            </div>
        {/if}
    </div>
{/if}
