<script lang="ts">
	import { CachePolicy } from '$houdini';
	import { user } from '$lib/userStore';
	import { getBookings, userBookings } from '$lib/bookingStore';
	import BookingCard from '$components/PersonalBookingComponents/BookingCard.svelte';
	import { onMount } from 'svelte';

	let bookings: any;

	const hey = async () => {
		console.log('test');
		await getBookings.fetch({
			policy: CachePolicy.NetworkOnly
		});
		console.log('Hey listen:', $getBookings.data?.getBookingsByUserId);
		bookings = $getBookings.data?.getBookingsByUserId;
		$userBookings = bookings;
	};

	onMount(() => {
		hey();
	});
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

{#if (bookings?.length === 0)}
  <p class="text-xl">No future bookings</p>
{/if}

<!--<div class="flex flex-wrap">-->
<!--	{#if bookings}-->
<!--		{#each $userBookings ?? [] as booking}-->
<!--			<BookingCard thisBooking={booking} />-->
<!--		{/each}-->
<!--	{/if}-->
<!--</div>-->
