import type { Seatinput } from "$houdini";
import { writable } from "svelte/store";
import type { SelectedSeat } from "./types/seatTypes";

export const selectedSeat = writable<SelectedSeat>({
    element: null,
	seat: null
});

export const allSeats = writable<Seatinput[]>([]);