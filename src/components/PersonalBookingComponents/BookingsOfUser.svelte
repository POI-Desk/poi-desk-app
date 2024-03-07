<script lang="ts">
  import { user } from "$lib/userStore";
  import { getBookingsOfUserAndTime, userBookings } from "$lib/bookingStore";
  import BookingCard from "$components/PersonalBookingComponents/BookingCard.svelte";
  import { CachePolicy } from "$houdini";
	import { onMount } from "svelte";


  export let isCurrentBookings = true;
  $: $userBookings = bookings as any;
  $: usrid = $user?.pk_userid;
  $: bookings = $getBookingsOfUserAndTime.data?.getBookingsByUserAndCurrent;

  onMount(() => {
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
  <p></p>
{:then fetched}
  {#each bookings ?? [] as booking}
    <BookingCard
      canEdit="{true}"
      thisBooking={booking}
    />
  {/each}
{/await}

{#if (bookings?.length === 0)}
  <p class="text-xl">No future bookings</p>
{/if}
