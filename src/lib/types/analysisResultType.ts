export type AnalysisResult = {
	month: string;
	amountOfDesks: number;
	highestBookings: number | null;
	averageBookings: number | null;
	lowestBookings: number | null;
	totalBooking: number | null;
};

export type AnalysisComparisonInfo = {
	firstYear: string | null;
	firstMonth: string | null;
	secondYear: string | null;
	secondMonth: string | null;
	showType: 'Days' | 'Data';
};

