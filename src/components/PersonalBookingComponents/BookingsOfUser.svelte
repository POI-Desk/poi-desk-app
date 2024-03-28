<script lang="ts">
	import { CachePolicy } from '$houdini';
	import { user } from '$lib/userStore';
	import { getBookings } from '$lib/bookingStore';
	import BookingCard from '$components/PersonalBookingComponents/BookingCard.svelte';
	import { onMount } from 'svelte';

	let bookings: any;
	export let isCurrentBookings = true;

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
