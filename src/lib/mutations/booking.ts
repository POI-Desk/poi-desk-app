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

export const editBooking = graphql(`
	mutation EditBooking($bookingInput:EditBookingInput!) {
		editBooking(bookingInput: $bookingInput) {
			bookingnumber
		}
	}
`);
