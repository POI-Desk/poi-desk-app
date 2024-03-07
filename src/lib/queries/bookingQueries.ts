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

export const getBookingsByNumContains = graphql(`
    query GetBookingsByBookingnumberContains($string: String!) {
        getBookingsByBookingnumberContains(string: $string) {
            pk_bookingid
            bookingnumber
        }
    }
`);
