<script lang="ts">
  import { getModalStore } from "@skeletonlabs/skeleton";
  import { displayedTime, interval, selectedDesk } from "$lib/bookingStore";
  import { dateValue, maxBookingDate, todaysDate } from "$lib/dateStore";
  import { bookDesk } from "$lib/mutations/booking";
  import { user } from "$lib/userStore";
  import BookingDeskState from "$components/SetBookingComponents/BookingDeskState.svelte";

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
    ArrowLeft
  } from "lucide-svelte";
  import { refreshDesks } from "$lib/refreshStore";
  import { getBookingsByDate } from "$lib/queries/booking";
  import { CachePolicy } from "$houdini";
  import { floorid } from "$lib/floorStore";

  $interval.morning = false;
  $interval.afternoon = false;

  async function finishBooking() {
    const value = await bookDesk.mutate({
      booking: {
        date: $dateValue,
        ismorning: $interval.morning,
        isafternoon: $interval.afternoon,
        userid: $user.pk_userid,
        deskid: $selectedDesk.pk_deskid,
        extendedid: ""
      }
    });

    await getBookingsByDate.fetch({
      variables: { date: $dateValue, floorId: $floorid },
      policy: CachePolicy.NetworkOnly
    });

    $refreshDesks = !$refreshDesks;
    modalStore.close();
  }

  function onExitHandler() {
    modalStore.close();
    $dateValue = new Date().toISOString().split("T")[0];
  }

  let date: Date = new Date($dateValue);

  let selectionPage: boolean = true;

  let currentBookingsOnDate = $selectedDesk.bookings.filter((b: any) => b.date === $dateValue);

  let hasBookings: boolean = currentBookingsOnDate.length > 0;

  let isBookedMorning: boolean =
    ((hasBookings && currentBookingsOnDate[0].ismorning) || currentBookingsOnDate[1]?.ismorning) ??
    false;

  let isBookedAfternoon: boolean =
    ((hasBookings && currentBookingsOnDate[0].isafternoon) ||
      currentBookingsOnDate[1]?.isafternoon) ??
    false;

  let isFullDay: boolean = hasBookings && isBookedMorning && isBookedAfternoon;

  const modalStore = getModalStore();

  const cBase = "card p-4 shadow-xl space-y-4";

  function whenSelection() {
    const selectedDate = new Date($dateValue);
    const isInBookingRange = selectedDate.getTime() >= todaysDate.setHours(0, 0, 0, 0)
      && selectedDate.getTime() <= maxBookingDate.getTime();
    if (!isFullDay && isInBookingRange) {
      if (!$interval.morning && !$interval.afternoon) {
        return;
      }
      selectionPage = !selectionPage;
      return;
    }
  }

  function addDay() {
    let date = new Date($dateValue);
    date.setDate(date.getDate() + 1);
    $dateValue = date.toISOString().split("T")[0]; // format back to 'yyyy-mm-dd'
    console.log($dateValue);
  }

  function subtractDay() {
    if ($dateValue === new Date().toISOString().split("T")[0]) {
      return;
    }
    let date = new Date($dateValue);
    date.setDate(date.getDate() - 1);
    $dateValue = date.toISOString().split("T")[0]; // format back to 'yyyy-mm-dd'
  }

  window.addEventListener("popstate", () => {
    modalStore.close();
  });

  const iconContainerClasses = "rounded-3xl flex justify-center variant-filled-tertiary";
  const textClasses = "col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white";
</script>

{#if $modalStore[0]}
  <div class="{cBase} rounded-xl lg:w-[470px] w-screen h-screen flex flex-col bg-slate-200">
    {#if selectionPage}
      <div class=" flex justify-center items-center">
        <div class="flex items-center gap-x-5 bg-white text-primary-500 rounded-full p-4 px-10">
          <h1>{$selectedDesk.desknum}</h1>
        </div>
        <button
          on:click={() => onExitHandler()}
          class="absolute right-0 pr-7 px-4 py-2 rounded-full"
        >
          <X />
        </button>
      </div>
      <div class="basis-full text-primary-500 font-bold">
        <BookingDeskState />
        <!---->
        <!--<BookingDeskState shownInterval="afternoon" />-->
      </div>
      <div class="bg-white text-primary-500 h-24 rounded-full flex items-center justify-between px-10">
        <button on:click={subtractDay}>
          <ArrowBigLeft />
        </button>
        <h1>{$dateValue}</h1>
        <button on:click={addDay}>
          <ArrowBigRight />
        </button>
      </div>
      <div class="variant-filled-tertiary h-24 rounded-full">
        <button on:click={() => whenSelection()} class="btn rounded-full w-full h-full text-xl variant-filled-primary"
        >Book
        </button
        >
      </div>
    {:else}
      <div class="grid grid-cols-3 text-center align-middle px-4 pt-5">
        <button
          on:click={() => {selectionPage = !selectionPage; $interval.morning = false; $interval.afternoon = false;}}
        >
          <ArrowLeft />
        </button>
        <h1 class="text-center text-3xl p-3">Booking</h1>
      </div>
      <div class="h-full flex items-center justify-center text-primary-500">
        <div class="grid grid-cols-3 grid-rows-6 gap-7">
          <div class="{iconContainerClasses}">
            <div class="rounded-3xl m-3 mx-5">
              <Calendar />
            </div>
          </div>
          <div class="{textClasses}">
            {date.toLocaleDateString('de-DE')}
          </div>
          <div class="{iconContainerClasses}">
            <div class="rounded-3xl m-3 mx-5">
              <Clock />
            </div>
          </div>
          <div class="{textClasses}">
            {$displayedTime}
          </div>
          <div class="{iconContainerClasses}">
            <div class="rounded-3xl m-3 mx-5">
              <MapPin />
            </div>
          </div>
          <div class="{textClasses}">
            {$user.location?.locationname}
          </div>
          <div class="{iconContainerClasses}">
            <div class="rounded-3xl m-3 mx-5">
              <Building />
            </div>
          </div>
          <div class="{textClasses}">
            {$selectedDesk.floor.building.buildingname}
          </div>
          <div class="{iconContainerClasses}">
            <div class="rounded-3xl m-3 mx-5">
              <Cuboid />
            </div>
          </div>
          <div class="{textClasses}">
            {$selectedDesk.floor.floorname}
          </div>
          <div class="{iconContainerClasses}">
            <div class="rounded-3xl m-3 mx-5">
              <Armchair />
            </div>
          </div>
          <div class="{textClasses}">
            {$selectedDesk.desknum}
          </div>
        </div>
      </div>
      <div class="variant-filled-tertiary h-24 rounded-full">
        <button on:click={() => finishBooking()} class="btn rounded-full w-full h-full text-xl variant-filled-primary"
        >Book
        </button
        >
      </div>
    {/if}
  </div>
{/if}
