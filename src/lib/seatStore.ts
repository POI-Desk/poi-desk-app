import { writable } from 'svelte/store';
import type { SelectedSeat } from './types/seatTypes';
import type { Seatinput } from '$houdini/artifacts/AddSeatsToFloor';

export const selectedSeat = writable<SelectedSeat>({
	element: null,
	seat: null
});

export const allSeats = writable<SelectedSeat[]>([]);

export const deskProps = {
	width: 100,
	height: 50
};
