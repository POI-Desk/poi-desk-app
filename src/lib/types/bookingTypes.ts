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

export type Desk = {
	readonly pk_deskid: string;
	readonly desknum: string;
	readonly x: number;
	readonly y: number;
	readonly bookings:
		| {
				readonly user: {
					readonly pk_userid: string;
				} | null;
				readonly date: string;
		  }[]
		| null;
};
