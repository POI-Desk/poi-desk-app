import {graphql} from "$houdini";

export const MonthlyBookings = graphql(`
	query getMonthlyBooking($year: String!, $month: String!, $location: ID!) {
		getMonthlyBooking(year: $year, month: $month, location: $location) {
			pk_monthlyBookingId
			amountOfDesks
			highestBookings
			averageBookings
			lowestBookings
			totalBooking
			month
			dailyBookings {
				pk_day
				totalBooking
			}
		}
	}
`);

export const QuarterlyBookings = graphql(`
	query getQuarterlyBooking($year: String!, $quarter: String!, $location: ID!) {
		getQuarterlyBooking(year: $year, quarter: $quarter, location: $location) {
			pk_quarterlyBookingId
			amountOfDesks
			highestBookings
			lowestBookings
			averageBookings
			quarter
			totalBooking
			monthlyBookings{
				month
				dailyBookings {
					pk_day
					totalBooking
				}
			}
		}
	}
`);


export const YearlyBookings = graphql(`
	query getYearlyBooking($year: String!, $location: ID!) {
		getYearlyBooking(year: $year, location: $location) {
			pk_yearlyBookingId
			amountOfDesks
			highestBookings
			lowestBookings
			averageBookings
			totalBooking
			quarterlyBookings {
				quarter
				monthlyBookings {
					month
					dailyBookings {
						pk_day
						totalBooking
					}
				}
			}
		}
	}
`);