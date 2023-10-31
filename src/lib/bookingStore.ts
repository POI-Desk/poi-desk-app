import { graphql } from '$houdini';
import { writable } from 'svelte/store';
import type { Booking, Interval } from './types/bookingTypes';

export const interval = writable<Interval>({
	morning: false,
	afternoon: false
});

export const currentBooking = writable<Booking>({
	booking_id: '',
	table_id: '',
	date: '',
	interval: {
		morning: false,
		afternoon: false
	}
});

export const selectedDesk = writable<any>();

export const _getBookingsByUseridVariables = () => {
	return {};
};

export const getBookings = graphql(`
	query getBookingsByUserid($userid: ID!) @load {
		getBookingsByUserid(userid: $userid) {
			isafternoon
			ismorning
			pk_bookingid
			bookingnumber
			date
		}
	}
`);
