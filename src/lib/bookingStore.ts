import { graphql } from '$houdini';
import { writable } from 'svelte/store';
import type { Booking, Interval } from "./types/bookingTypes";

export const interval = writable<Interval>({
	morning: false,
	afternoon: false
});

export const displayedTime = writable<string>('');

export const morningSelected = writable<boolean>(false);
export const afternoonSelected = writable<boolean>(false);


export const currentBooking = writable<any>({});

export const _getBookingsByUseridVariables = () => {
	return {};
};


export const getBookings = graphql(`
	query getBookingsByUserid($isCurrent: Boolean!) @load {
		getBookingsByUserid(isCurrent: $isCurrent) {
			isafternoon
			ismorning
			pk_bookingid
			bookingnumber
			date
			desk {
				pk_deskid
				desknum
				map{
					floor{
						pk_floorid
						floorname
						building{
							pk_buildingid
							buildingname
							location{
								pk_locationid
								locationname
							}
						}
					}
				}
			}
		}
	}
`);