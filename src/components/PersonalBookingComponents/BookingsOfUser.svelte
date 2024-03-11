<script lang="ts">
	import { CachePolicy } from '$houdini';
	import { user } from '$lib/userStore';
	import { getBookings, userBookings } from '$lib/bookingStore';
	import BookingCard from '$components/PersonalBookingComponents/BookingCard.svelte';
	import { onMount } from 'svelte';
	import BottomNav from '$components/BottomNav.svelte';

	let bookings: any;
	export let isCurrentBookings = true;

	$: $userBookings = bookings as any;
	$: usrid = $user?.pk_userid;

	onMount(() => {
		getBookings.fetch({ variables: { isCurrent: isCurrentBookings } });
	});

	$: bookings = $getBookings.data?.getBookingsByUserid;

	$: {
		if ($user.pk_userid != '') {
			getBookings.fetch({
				variables: { isCurrent: isCurrentBookings }
			});
		}
	}
</script>

{#await getBookings.fetch( { variables: { isCurrent: isCurrentBookings }, policy: CachePolicy.NetworkOnly } )}
	<p />
{:then fetched}
	{#each fetched.data?.getBookingsByUserid ?? [] as booking}
		<BookingCard thisBooking={booking} />
	{/each}
{/await}

{#if bookings?.length === 0}
	<p class="text-4xl text-primary-500">
		{isCurrentBookings ? 'No current bookings' : 'No past bookings'}
	</p>
{/if}

<div class="absolute bottom-0 w-screen">
	<BottomNav />
</div>

<!-- <BottomNav /> -->

<!--<div class="flex flex-wrap">-->
<!--	{#if bookings}-->
<!--		{#each $userBookings ?? [] as booking}-->
<!--			<BookingCard thisBooking={booking} />-->
<!--		{/each}-->
<!--	{/if}-->
<!--</div>-->
