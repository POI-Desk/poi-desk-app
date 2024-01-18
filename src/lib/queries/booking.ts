import { graphql } from '$houdini';

export const getBookingsByDate = graphql(`
	query GetBookingsByDateOnFloor($date: String!, $floorId: ID!) {
		getBookingsByDateOnFloor(date: $date, floorId: $floorId) {
			pk_bookingid
			bookingnumber
			isafternoon
			ismorning
			date
			desk {
				pk_deskid
			}
		}
	}
`);