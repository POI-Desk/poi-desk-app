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
		}
	}
`);

export const getBookingsByDateBetween = graphql(`
	query GetBookingsByDateBetween($startDate: String!, $endDate: String!) {
		getBookingsByDateBetween(startDate: $startDate, endDate: $endDate) {
			pk_bookingid
			bookingnumber
			isafternoon
			ismorning
			date
			desk {
				pk_deskid
				desknum
			}
		}
	}
`);

