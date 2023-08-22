import { writable } from 'svelte/store';

export const bookings = writable([
	{
		id: 1,
		date: '2021-01-01',
		time: '10:00'
	},
	{
		id: 2,
		date: '2021-02-01',
		time: '11:00'
	},
	{
		id: 3,
		date: '2021-03-01',
		time: '12:00'
	}
]);
