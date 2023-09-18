import { writable } from 'svelte/store';
import type { SelectedSeat } from '../../types/seatTypes';

export const selectedDesk = writable<SelectedSeat>({
	element: null,
	desk: null
});

export const allDesks = writable<SelectedSeat[]>([]);