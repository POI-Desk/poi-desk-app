export type Booking = {
	booking_id: string;
	table_id: string;
	date: string;
	interval: Interval;
};

export type Interval = {
	morning: boolean;
	afternoon: boolean;
};


