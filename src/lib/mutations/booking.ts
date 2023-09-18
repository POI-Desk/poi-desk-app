import { graphql } from '$houdini';

export const delBooking = graphql(`
	mutation DeleteBooking($id: ID!) {
		deleteBooking(bookingId: $id)
	}
`);

export const bookDesk = graphql(`
	mutation BookDesk($booking: Bookinginput!) {
		bookDesk(booking: $booking) {
			bookingnumber
		}
	}
`);
