import {writable} from "svelte/store";

export const dateValue = writable("");

export const bookingPeriod: number = 14; // max. days users can book into the future

export const todaysDate = new Date();

export const today = todaysDate.toISOString().split("T")[0];



export const maxBookingDate = new Date(new Date().setDate(new Date().getDate() + bookingPeriod));

export const maxBookingValue = maxBookingDate.toISOString().split("T")[0];
