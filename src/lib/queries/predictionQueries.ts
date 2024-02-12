import { graphql } from '$houdini';


export const getMonthlyBookingPrediction = graphql(`
	query getMonthlyBookingPrediction($identifier: ID!, $identifierType: IdentifierType!) {
		getMonthlyBookingPrediction(identifier: $identifier, identifierType: $identifierType) {
			month
    totalBookings
    morning_highestBooking
    morningAverageBooking
    morning_lowestBooking
    afternoon_highestBooking
    afternoonAverageBooking
    afternoon_lowestBooking
		}
	}
`);

export const getQuarterlyBookingPrediction = graphql(`
	query getQuarterlyBookingPrediction($identifier: ID!, $identifierType: IdentifierType!) {
		getQuarterlyBookingPrediction(identifier: $identifier, identifierType: $identifierType) {
			year
      quarter
			totalBookings
			morning_highestBooking
			morningAverageBooking
			morning_lowestBooking
			afternoon_highestBooking
			afternoonAverageBooking
			afternoon_lowestBooking
		}
	}
`);

export const getYearlyBookingPrediction = graphql(`
	query getYearlyBookingPrediction($identifier: ID!, $identifierType: IdentifierType!) {
		getYearlyBookingPrediction(identifier: $identifier, identifierType: $identifierType) {
			year
			totalBookings
			morning_highestBooking
			morningAverageBooking
			morning_lowestBooking
			afternoon_highestBooking
			afternoonAverageBooking
			afternoon_lowestBooking
		}
	}
`);