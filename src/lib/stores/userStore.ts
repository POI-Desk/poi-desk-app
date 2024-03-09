import { writable } from "svelte/store";
import type { User } from "../types/userTypes";
import type { Role } from "../types/roleTypes";

export const user = writable<User>({
	pk_userid: '',
	username: '',
	location: null,
	teams: null,
	roles: null
});

export const currentLocation = writable("");