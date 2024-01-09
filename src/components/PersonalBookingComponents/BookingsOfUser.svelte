<script lang="ts">
	import { CachePolicy, graphql } from '$houdini';
	import { user } from '$lib/userStore';
	import { delBooking } from '$lib/mutations/booking';
	import { getBookings, userBookings } from '$lib/bookingStore';
	import BookingCard from '$components/PersonalBookingComponents/BookingCard.svelte';

	$: console.log("User:",$user?.pk_userid)
	$: usrid = $user?.pk_userid;

	// export const _getBookingsByUseridVariables = () => {
	// 	return {userid: usrid};
	// };

	getBookings.fetch({ variables: { userid: usrid ?? '' } });

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
	$: $userBookings = bookings as any;

	$: {
		if ($user.pk_userid != '') {
			getBookings.fetch({ variables: { userid: $user.pk_userid ?? '' } });
		}
	}

</script>

<div class="flex flex-wrap">
	{#await getBookings.fetch({ variables: { userid: usrid } })}
		<h1>Fetching data:</h1>
	{:then} 
		{#each $userBookings ?? [] as booking}
			<BookingCard 
				thisBooking = {booking}
				
				/>
		{/each}
	{/await}
</div>
