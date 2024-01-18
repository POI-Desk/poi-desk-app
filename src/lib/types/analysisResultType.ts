export type Day = {
	day: number;
	morning: number;
	afternoon: number;
	totalBookings: number;
};

export type Month = {
	month: string;
	dailyBookings: Day[];
};

export type Quarter = {
	year: string;
	quarter: string;
	monthlyBookings: Month[];
};

export type Year = {
	year: string;
	quarterlyBookings: Quarter[];
};

export type AnalysisData = {
	time: string;
	totalBookings: number;
	days: number;
	amountOfDesks: number;
	morning_highestBooking: {
		days: string;
		morning: number;
		afternoon: number;
	};
	morningAverageBooking: number;
	morning_lowestBooking: {
		days: string;
		morning: number;
		afternoon: number;
	};
	afternoon_highestBooking: {
		days: string;
		morning: number;
		afternoon: number;
	};
	afternoonAverageBooking: number
	afternoon_lowestBooking: {
		days: string;
		morning: number;
		afternoon: number;
	};
};

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

