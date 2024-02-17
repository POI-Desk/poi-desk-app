import { writable } from 'svelte/store';

export const saveChangesClicked = writable(false);
export const isSaveDisabled = writable(true);

export const newBuildings = writable([]);

export const locationNames = writable([""]);
export const newLocation = writable({id: "", name: ""});

export const refreshLocations = writable(true);

export const editBuildingclicked = writable(false);
export const newFloors = writable([]);