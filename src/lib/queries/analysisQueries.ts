import { graphql } from '$houdini';

export const MonthlyBookingsByLocation = graphql(`
	query getMonthlyBookingByLocation($year: String!, $month: String!, $location: ID!) {
		getMonthlyBookingByLocation(year: $year, month: $month, location: $location) {
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

export const MonthlyBookingDataByLocation = graphql(`
	query getMonthlyBookingDataByLocation($year: String!, $month: String!, $location: ID!) {
		getMonthlyBookingByLocation(year: $year, month: $month, location: $location) {
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

export const MonthlyBookingsByBuilding = graphql(`
	query getMonthlyBookingByBuilding($year: String!, $month: String!, $building: ID!) {
		getMonthlyBookingByBuilding(year: $year, month: $month, building: $building) {
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

export const MonthlyBookingDataByBuilding = graphql(`
	query getMonthlyBookingDataByBuilding($year: String!, $month: String!, $building: ID!) {
		getMonthlyBookingByBuilding(year: $year, month: $month, building: $building) {
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

export const MonthlyBookingsByFloor = graphql(`
	query getMonthlyBookingByFloor($year: String!, $month: String!, $floor: ID!) {
		getMonthlyBookingByFloor(year: $year, month: $month, floor: $floor) {
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

export const MonthlyBookingDataByFloor = graphql(`
	query getMonthlyBookingDataByFloor($year: String! $month: String! $floor: ID!) {
		getMonthlyBookingByFloor(year: $year, month: $month, floor: $floor) {
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

export const QuarterlyBookingsByLocation = graphql(`
	query getQuarterlyBookingByLocation($year: String!, $quarter: Int!, $location: ID!) {
		getQuarterlyBookingByLocation(year: $year, quarter: $quarter, location: $location) {
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

export const QuarterlyBookingDataByLocation = graphql(`
	query getQuarterlyBookingDataByLocation($year: String!, $quarter: Int!, $location: ID!) {
		getQuarterlyBookingByLocation(year: $year, quarter: $quarter, location: $location) {
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

export const QuarterlyBookingsByBuilding = graphql(`
	query getQuarterlyBookingByBuilding($year: String!, $quarter: Int!, $building: ID!) {
		getQuarterlyBookingByBuilding(year: $year, quarter: $quarter, building: $building) {
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

export const QuarterlyBookingDataByBuilding = graphql(`
	query getQuarterlyBookingDataByBuilding($year: String!, $quarter: Int!, $building: ID!) {
		getQuarterlyBookingByBuilding(year: $year, quarter: $quarter, building: $building) {
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

export const QuarterlyBookingsByFloor = graphql(`
	query getQuarterlyBookingByFloor($year: String!, $quarter: Int!, $floor: ID!) {
		getQuarterlyBookingByFloor(year: $year, quarter: $quarter, floor: $floor) {
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

export const QuarterlyBookingDataByFloor = graphql(`
	query getQuarterlyBookingDataByFloor($year: String!, $quarter: Int!, $floor: ID!) {
		getQuarterlyBookingByFloor(year: $year, quarter: $quarter, floor: $floor) {
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
export const YearlyBookingsByLocation = graphql(`
	query getYearlyBookingByLocation($year: String!, $location: ID!) {
		getYearlyBookingByLocation(year: $year, location: $location) {
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
export const YearlyBookingDataByLocation = graphql(`
	query getYearlyBookingDataByLocation($year: String!, $location: ID!) {
		getYearlyBookingByLocation(year: $year, location: $location) {
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
export const YearlyBookingsByBuilding = graphql(`
	query getYearlyBookingByBuilding($year: String!, $building: ID!) {
		getYearlyBookingByBuilding(year: $year, building: $building) {
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
export const YearlyBookingDataByBuilding = graphql(`
	query getYearlyBookingDataByBuilding($year: String!, $building: ID!) {
		getYearlyBookingByBuilding(year: $year, building: $building) {
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

export const YearlyBookingsByFloor = graphql(`
	query getYearlyBookingByFloor($year: String!, $floor: ID!) {
		getYearlyBookingByFloor(year: $year, floor: $floor) {
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
export const YearlyBookingDataByFloor = graphql(`
	query getYearlyBookingDataByFloor($year: String!, $floor: ID!) {
		getYearlyBookingByFloor(year: $year, floor: $floor) {
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


export const YearsSinceStart = graphql(`
	query getAllYears{
		getAllYears
	}
`);