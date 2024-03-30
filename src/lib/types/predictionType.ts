import type { Building } from '$lib/types/buildingType';
import type { Floor } from '$lib/types/floorType';

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
export type QuarterlyPrediction = {
	year: string | null;
	quarter: number | null;
	totalBookings: number | null;
	morning_highestBooking: number | null;
	morningAverageBooking: number | null;
	morning_lowestBooking: number | null;
	afternoon_highestBooking: number | null;
	afternoonAverageBooking: number | null;
	afternoon_lowestBooking: number | null;
};
export type YearlyPrediction = {
	year: string | null;
	totalBookings: number | null;
	morning_highestBooking: number | null;
	morningAverageBooking: number | null;
	morning_lowestBooking: number | null;
	afternoon_highestBooking: number | null;
	afternoonAverageBooking: number | null;
	afternoon_lowestBooking: number | null;
};

export type PredictionSelection = {
	Building: Building | null;
	Floor: Floor | null;
	showType: 'Month' | 'Quarter' | 'Year';
};

export type PredictionData = {
	total: number[];
	morning_highestBooking: number[];
	morningAverageBooking: number[];
	morning_lowestBooking: number[];
	afternoon_highestBooking: number[];
	afternoonAverageBooking: number[];
	afternoon_lowestBooking: number[];
}

export type PredictionDays = {
	year: string[];
	quarter: string[] 
	month: string[];
};

