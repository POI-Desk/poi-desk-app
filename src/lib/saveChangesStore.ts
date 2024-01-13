import { writable } from 'svelte/store';

export const saveChangesClicked = writable(false);
export const saveChangesClickable = writable(false);