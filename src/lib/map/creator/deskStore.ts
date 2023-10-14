import { writable } from 'svelte/store';
import type { Desk } from '../../types/deskTypes';

export const selectedDesk = writable<Desk>({
	element: null,
	desk: null
});

export const allDesks = writable<Desk[]>([]);