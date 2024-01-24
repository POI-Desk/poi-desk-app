import { writable } from 'svelte/store';

export const saveChangesClicked = writable(false);
export const isSaveDisabled = writable(true);

export const newBuildingNames = writable([""]);

export const locationNames = writable([""]);
export const newLocationName = writable("");