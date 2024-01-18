<script lang="ts">
	import { CachePolicy, graphql } from "$houdini";
	import { user } from "$lib/userStore";
	import { delBooking } from "$lib/mutations/booking";
	import { getBookings } from "$lib/bookingStore";
	import BookingCard from "$components/PersonalBookingComponents/BookingCard.svelte";
	import type { Booking } from "$lib/types/bookingTypes";

	const getBookingByNumContains = graphql(`
        query GetBookingsByBookingnumberContains($string: String!) @load {
            getBookingsByBookingnumberContains(string: $string) {
                pk_bookingid
                bookingnumber
           }
        }
    `);
    export const _getBookingByNumContains = () => {
        return {};
    };

    $: extendedBookings = $getBookingByNumContains.data?.getBookingsByBookingnumberContains;

    const deleteBooking = async (booking: Booking) => {
        const id = booking.booking_id;

        if (booking.bookingnumber.includes("EXT-ID")) {
            const extId = booking.bookingnumber.split("EXT-ID")[1];

            if (extId !== $user.pk_userid) return

            await getBookingByNumContains.fetch({variables: {string: extId}});
            for (const b of extendedBookings ?? []) {
                await delBooking.mutate({id: b.pk_bookingid})
            }
        } else {
            await delBooking.mutate({id});
        }

        await getBookings.fetch({policy: CachePolicy.NetworkOnly}); //TODO: DONT FETCH THIS! DELETE FROM ARRAY
    };

    $: console.log("User:", $user?.pk_userid)
    $: usrid = $user?.pk_userid;

    // export const _getBookingsByUseridVariables = () => {
    // 	return {userid: usrid};
    // };

    getBookings.fetch({variables: {userid: usrid ?? ''}});

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
            getBookings.fetch({variables: {userid: $user.pk_userid ?? ''}});
        }
    }

</script>

<div class="flex flex-wrap">
	{#await getBookings.fetch({ variables: { userid: usrid } })}
		<p></p>
	{:then fetched}
		{#each bookings ?? [] as booking}
			{console.log(booking)}
			<BookingCard 
				thisBooking = {booking}
				on:deleteBooking={async () => await deleteBooking(booking?.pk_bookingid ?? 'lol du stinkst')}
				/>
		{/each}
	{/await}
</div>
