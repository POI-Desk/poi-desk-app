import type { Building } from '$lib/types/buildingType';
import type { Floor } from '$lib/types/floorType';

export type Day = {
	day: number;
	morning: number;
	afternoon: number;
	total: number;
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
	total: number;
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
	afternoonAverageBooking: number;
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
	Year: string | null;
	Month: string | null;
	Building: Building | null;
	Floor: Floor | null;
};

export type AnalysisComparisonInfoBoth = {
	first: AnalysisComparisonInfo;
	second: AnalysisComparisonInfo;
	showType: 'Days' | 'Data';
};

export type AnaylsisSelection = {
	Year: string | null;
	Month: string | null;
	Building: Building | null;
	Floor: Floor | null;
	showType: 'Days' | 'Data';
};