<script lang="ts">
	import { CachePolicy, graphql } from '$houdini';
	import { user } from '$lib/userStore';
	import { delBooking } from '$lib/mutations/booking';
	import { getBookings } from '$lib/bookingStore';
	import BookingCard from '$components/PersonalBookingComponents/BookingCard.svelte';

	
	const deleteBooking = async (id: string) => {
		await delBooking.mutate({ id });
		await getBookings.fetch({ policy: CachePolicy.NetworkOnly }); //TODO: DONT FETCH THIS! DELETE FROM ARRAY
	};

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

	$: {
		if ($user.pk_userid != '') {
			getBookings.fetch({ variables: { userid: $user.pk_userid ?? '' } });
		}
	}

</script>

<div class="flex flex-wrap">
	{#await getBookings.fetch({ variables: { userid: usrid } })}
	{:then} 
		{#each bookings ?? [] as booking}
			{console.log(booking)}
			<BookingCard 
				thisBooking = {booking}
				on:deleteBooking={async () => await deleteBooking(booking?.pk_bookingid ?? 'lol du stinkst')}
				/>
		{/each}
	{/await}
</div>
