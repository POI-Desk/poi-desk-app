export type Booking = {
	booking_id: number;
	table_id: string;
	date: string;
	interval: Interval;
};

export type Interval = {
	morning: boolean;
	afternoon: boolean;
};
