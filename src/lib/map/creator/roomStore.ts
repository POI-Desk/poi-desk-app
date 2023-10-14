import type { Room } from "$lib/types/roomTypes";
import { writable } from "svelte/store";

export const selectedRoom = writable<Room>({
  element: null,
  room: null
});

export const allDesks = writable<Room[]>([]);