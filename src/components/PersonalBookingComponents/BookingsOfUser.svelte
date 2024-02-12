<script lang="ts">
  import { user } from "$lib/userStore";
  import { getBookings, userBookings } from "$lib/bookingStore";
  import BookingCard from "$components/PersonalBookingComponents/BookingCard.svelte";
  import { CachePolicy } from "$houdini";


  export let isCurrentBookings = true;
  $: $userBookings = bookings as any;
  $: console.log("User:", $user?.pk_userid);
  $: usrid = $user?.pk_userid;

  getBookings.fetch({ variables: { userid: usrid ?? "", isCurrent: isCurrentBookings } });

  $: bookings = $getBookings.data?.getBookingsByUserid;

  $: {
    if ($user.pk_userid != "") {
      getBookings.fetch({ variables: { userid: $user.pk_userid ?? "", isCurrent: isCurrentBookings } });
    }
  }
  
//   let bookings: any;

// 	const hey = async () => {
// 		await getBookings.fetch({
// 			variables: { userid: $user?.pk_userid },
// 			policy: CachePolicy.NetworkOnly
// 		});
// 		console.log($getBookings.data?.getBookingsByUserid);
// 	};

// 	$: {
// 		hey();
// 	}

// 	$: {
// 		bookings = $getBookings.data?.getBookingsByUserid;
// 		$userBookings = bookings;
// 	}

</script>

{#await getBookings.fetch({
  variables: { userid: usrid, isCurrent: isCurrentBookings },
  policy: CachePolicy.NetworkOnly
})}
  <p></p>
{:then fetched}
  {#each bookings ?? [] as booking}
    <BookingCard
      thisBooking={booking}
    />
  {/each}
{/await}

<div class="flex flex-wrap">
	{#if bookings}
		{#each $userBookings ?? [] as booking}
			<BookingCard thisBooking={booking} />
		{/each}
	{/if}
</div>
