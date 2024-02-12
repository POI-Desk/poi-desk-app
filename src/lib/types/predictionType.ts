export type MonthlyPrediction = {
	month: string | null;
	totalBookings: number | null;
	morning_highestBooking: number | null;
	morningAverageBooking: number | null;
	morning_lowestBooking: number | null;
	afternoon_highestBooking: number | null;
	afternoonAverageBooking: number | null;
	afternoon_lowestBooking: number | null;
};