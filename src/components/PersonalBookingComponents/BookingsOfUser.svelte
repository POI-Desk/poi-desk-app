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

<div class="flex flex-wrap">
	{#if bookings}
		{#each $userBookings ?? [] as booking}
			<BookingCard thisBooking={booking} />
		{/each}
	{/if}
</div>
