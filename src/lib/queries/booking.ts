import { graphql } from '$houdini';

export const getBookingsByDate = graphql(`
	query GetBookingsByDate($date: String!) {
		getBookingsByDate(date: $date) {
			pk_bookingid
			bookingnumber
			isafternoon
			ismorning
			date
			desk {
				pk_deskid
			}
			user {
				pk_userid
				username
			}
		}
	}
`);
