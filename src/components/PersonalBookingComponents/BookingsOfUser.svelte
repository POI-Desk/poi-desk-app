<script lang="ts">
	import { CachePolicy } from '$houdini';
	import { user } from '$lib/userStore';
	import { getBookings, userBookings } from '$lib/bookingStore';
	import BookingCard from '$components/PersonalBookingComponents/BookingCard.svelte';
	import { onMount } from 'svelte';

	let bookings: any;
	export let isCurrentBookings = true;

	$: $userBookings = bookings as any;
	$: console.log('User:', $user?.pk_userid);
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
	{#each bookings ?? [] as booking}
		<BookingCard thisBooking={booking} />
	{/each}
{/await}

{#if bookings?.length === 0}
	<p class="text-xl">No future bookings</p>
{/if}

<!--<div class="flex flex-wrap">-->
<!--	{#if bookings}-->
<!--		{#each $userBookings ?? [] as booking}-->
<!--			<BookingCard thisBooking={booking} />-->
<!--		{/each}-->
<!--	{/if}-->
<!--</div>-->
