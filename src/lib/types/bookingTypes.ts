export type Booking = {
	pk_bookingid: string;
	deskid: string;
	date: string;
	interval: Interval;
	bookingnumber: string;
};

export type Interval = {
	morning: boolean;
	afternoon: boolean;
};


