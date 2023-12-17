import { graphql } from '$houdini';

export const MonthlyBookings = graphql(`
	query getMonthlyBooking($year: String!, $month: String!, $location: ID!) {
		getMonthlyBooking(year: $year, month: $month, location: $location) {
			pk_monthlyBookingId
			amountOfDesks
			month
			dailyBookings {
				day
				morning
				afternoon
				totalBookings
			}
		}
	}
`);

export const MonthlyBookingData = graphql(`
	query getMonthlyBookingData($year: String!, $month: String!, $location: ID!) {
		getMonthlyBooking(year: $year, month: $month, location: $location) {
			month
			totalBookings
			days
			amountOfDesks
			morning_highestBooking {
				day
				morning
				afternoon
			}
			morningAverageBooking
			morning_lowestBooking {
				day
				morning
				afternoon
			}
			afternoon_highestBooking {
				day
				morning
				afternoon
			}
			afternoonAverageBooking
			afternoon_lowestBooking {
				day
				morning
				afternoon
			}
		}
	}
`);

export const QuarterlyBookings = graphql(`
	query getQuarterlyBooking($year: String!, $quarter: String!, $location: ID!) {
		getQuarterlyBooking(year: $year, quarter: $quarter, location: $location) {
			pk_quarterlyBookingId
			amountOfDesks
			quarter
			totalBookings
			monthlyBookings {
				month
				dailyBookings {
					day
					morning
					afternoon
					totalBookings
				}
			}
		}
	}
`);

export const QuarterlyBookingData = graphql(`
	query getQuarterlyBookingData($year: String!, $quarter: String!, $location: ID!) {
		getQuarterlyBooking(year: $year, quarter: $quarter, location: $location) {
			year
			quarter
			totalBookings
			days
			amountOfDesks
			morning_highestBooking {
				day
				morning
				afternoon
			}
			morningAverageBooking
			morning_lowestBooking {
				day
				morning
				afternoon
			}
			afternoon_highestBooking {
				day
				morning
				afternoon
			}
			afternoonAverageBooking
			afternoon_lowestBooking {
				day
				morning
				afternoon
			}
		}
	}
`);


export const YearlyBookings = graphql(`
	query getYearlyBooking($year: String!, $location: ID!) {
		getYearlyBooking(year: $year, location: $location) {
			pk_yearlyBookingId
			amountOfDesks
			totalBookings
			quarterlyBookings {
				quarter
				monthlyBookings {
					month
					dailyBookings {
						day
						morning
						afternoon
						totalBookings
					}
				}
			}
		}
	}
`);
export const YearlyBookingData = graphql(`
	query getYearlyBookingData($year: String!, $location: ID!) {
		getYearlyBooking(year: $year, location: $location) {
			year
			totalBookings
			days
			amountOfDesks
			morning_highestBooking {
				day
				morning
				afternoon
			}
			morningAverageBooking
			morning_lowestBooking {
				day
				morning
				afternoon
			}
			afternoon_highestBooking {
				day
				morning
				afternoon
			}
			afternoonAverageBooking
			afternoon_lowestBooking {
				day
				morning
				afternoon
			}
		}
	}
`);
