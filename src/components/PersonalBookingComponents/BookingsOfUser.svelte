<script lang="ts">
  import { user } from "$lib/stores/userStore";
  import { getBookingsOfUserAndTime, userBookings } from "$lib/stores/bookingStore";
  import BookingCard from "$components/PersonalBookingComponents/BookingCard.svelte";
  import { CachePolicy } from "$houdini";
  import { onMount } from "svelte";
  import { curPage } from "$lib/stores/pageStore";
  import { ProgressBar } from "@skeletonlabs/skeleton";


  export let isCurrentBookings = true;
  $: $userBookings = bookings as any;
  $: usrid = $user?.pk_userid;
  $: bookings = $getBookingsOfUserAndTime.data?.getBookingsByUserAndCurrent;

  onMount(() => {
    $curPage = "/bookings";
    getBookingsOfUserAndTime.fetch({ variables: { userid: usrid ?? "", isCurrent: isCurrentBookings } });
  });


  $: {
    if ($user.pk_userid != "") {
      getBookingsOfUserAndTime.fetch({ variables: { userid: $user.pk_userid ?? "", isCurrent: isCurrentBookings } });
    }
  }
</script>

{#await getBookingsOfUserAndTime.fetch({
  variables: { userid: usrid, isCurrent: isCurrentBookings },
  policy: CachePolicy.NetworkOnly
})}
  <div
    class="flex variant-filled-primary rounded-3xl w-1/2"
  >
    <ProgressBar value={undefined} />
  </div>
{:then fetched}
  {#each bookings ?? [] as booking}
    <BookingCard
      canEdit="{true}"
      thisBooking={booking}
    />
  {/each}
{/await}

{#if (bookings?.length === 0)}
  {#if isCurrentBookings}
    <p class="text-xl">No future bookings</p>
  {:else }
    <p class="text-xl">No past bookings</p>
  {/if}
{/if}
