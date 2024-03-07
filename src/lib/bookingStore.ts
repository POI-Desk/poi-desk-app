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


export const currentBooking = writable<Booking>();

export const userBookings = writable<any>();

export const _getBookingsByUserIdVariables = () => {
	return {};
};

export const getBookings = graphql(`
    query getBookingsByUserId($userid: ID!) @load {
        getBookingsByUserId(userid: $userid) {
            isafternoon
            ismorning
            pk_bookingid
            bookingnumber
            date
            desk {
                pk_deskid
                desknum
                map {
                    floor {
                        pk_floorid
                        floorname
                        building {
                            pk_buildingid
                            buildingname
                            location {
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

export const _getBookingsByUserAndCurrentVariables = () => {
    return {};
};

export const getBookingsOfUserAndTime = graphql(`
    query getBookingsByUserAndCurrent($userid: ID!, $isCurrent: Boolean!) @load {
        getBookingsByUserAndCurrent(userid: $userid, isCurrent: $isCurrent) {
            isafternoon
            ismorning
            pk_bookingid
            bookingnumber
            date
            desk {
                pk_deskid
                desknum
                map {
                    floor {
                        pk_floorid
                        floorname
                        building {
                            pk_buildingid
                            buildingname
                            location {
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
