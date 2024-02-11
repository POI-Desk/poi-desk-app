<script lang="ts">
	import { CachePolicy } from '$houdini';
	import { user } from '$lib/userStore';
	import { getBookings, userBookings } from '$lib/bookingStore';
	import BookingCard from '$components/PersonalBookingComponents/BookingCard.svelte';

	let bookings: any;

	const hey = async () => {
		await getBookings.fetch({
			variables: { userid: $user?.pk_userid },
			policy: CachePolicy.NetworkOnly
		});
		console.log($getBookings.data?.getBookingsByUserid);
	};

	$: {
		hey();
	}

	$: {
		bookings = $getBookings.data?.getBookingsByUserid;
		$userBookings = bookings;
	}
</script>

<div class="flex flex-wrap">
	{#if bookings}
		{#each $userBookings ?? [] as booking}
			<BookingCard thisBooking={booking} />
		{/each}
	{/if}
</div>
