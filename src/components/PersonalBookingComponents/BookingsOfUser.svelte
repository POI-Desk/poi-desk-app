<script lang="ts">
  import { CachePolicy, graphql } from "$houdini";
  import { user } from "$lib/userStore";
  import { delBooking } from "$lib/mutations/booking";
  import { getBookings, userBookings } from "$lib/bookingStore";
  import BookingCard from "$components/PersonalBookingComponents/BookingCard.svelte";
  import type { Booking } from "$lib/types/bookingTypes";




  $: console.log("User:", $user?.pk_userid);
  $: usrid = $user?.pk_userid;



  $: $userBookings = bookings as any;
  $: console.log("User:", $user?.pk_userid);
  $: usrid = $user?.pk_userid;

  // export const _getBookingsByUseridVariables = () => {
  // 	return {userid: usrid};
  // };

  getBookings.fetch({ variables: { userid: usrid ?? "" } });

  // const getBookings = graphql(`
  // 	query getBookingsByUserid($userid: ID!) @load {
  // 		getBookingsByUserid(userid: $userid) {
  // 			pk_bookingid
  // 			bookingnumber
  // 			date
  // 		}
  // 	}
  // `);

  $: bookings = $getBookings.data?.getBookingsByUserid;

  $: {
    if ($user.pk_userid != "") {
      getBookings.fetch({ variables: { userid: $user.pk_userid ?? "" } });
    }
  }

</script>

<div class="flex flex-wrap">
  {#await getBookings.fetch({ variables: { userid: usrid } })}
    <p></p>
  {:then fetched}
    {#each bookings ?? [] as booking}
      <BookingCard
        thisBooking={booking}
      />
    {/each}
  {/await}
</div>
