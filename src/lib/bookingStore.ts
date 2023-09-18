import { writable } from 'svelte/store';
import type { Interval } from './types/bookingTypes';
import type { Booking } from './types/bookingTypes';
import {graphql} from "$houdini";

export const interval = writable<Interval>({
	morning: false,
	afternoon: false
});

export const booking = writable<Booking>({
  booking_id: 0,
  table_id: '',
  date: '',
  interval: {
    morning: false,
    afternoon: false
  }
});

export const addOutlook = writable(false);

export const _getBookingsByUseridVariables = () => {
  return {};
};

export const getBookings = graphql(`
		query getBookingsByUserid($userid: ID!) @load {
			getBookingsByUserid(userid: $userid) {
				pk_bookingid
				bookingnumber
				date
			}
		}
	`);