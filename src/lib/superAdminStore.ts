import type { Writable } from '$houdini';
import { writable } from 'svelte/store';


export const saveChangesClicked = writable(false);
export const isSaveDisabled = writable(true);

export const newBuildings = writable([]);

export const locationNames = writable([]);
export const newLocation = writable({id: "", name: ""});

export const refreshLocations = writable(true);

export const editBuildingclicked = writable(false);
export const newFloors = writable([]);

export const locationToEdit = writable({id: "", name: ""});
export const buildingToEdit = writable({id: "", name: ""});
export const floorsToEdit = writable<Map<string, string>>(new Map([]));
export const changedBuidings = writable<Map<string, string>>(new Map([]));

export const admins = writable([]);
export const admin = writable({pk_userid: "", name: ""});
export const adminsOfLocation = writable([]);
export const newAdmins = writable([]);
export const adminsToRemove = writable([]);

export const showTeams = writable(false);
export const teamToEdit = writable({teamname: "", pk_teamid: ""});
export const refreshTeams = writable(false);