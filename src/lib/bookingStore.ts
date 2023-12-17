import { graphql } from '$houdini';
import { writable } from 'svelte/store';
import type { Booking, Interval } from './types/bookingTypes';

export const interval = writable<Interval>({
	morning: false,
	afternoon: false
});

export const displayedTime = writable<string>('');

export const morningSelected = writable<boolean>(false);
export const afternoonSelected = writable<boolean>(false);


export const currentBooking = writable<any>({
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
			desk {
				desknum
				y
				x
				floor {
					pk_floorid
					floorname
					building {
						buildingname
						location {
							locationname
						}
					}
				}
			}
		}
	}
`);
