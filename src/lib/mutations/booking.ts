import { graphql } from '$houdini';

export const delBooking = graphql(`
	mutation DeleteBooking($id: ID!) {
		deleteBooking(bookingId: $id)
	}
`);
