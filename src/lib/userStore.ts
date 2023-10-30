import { writable } from "svelte/store";
import type { User } from "./types/userTypes";

export const user = writable<User>({
	pk_userid: '89870005-723a-4a40-90c4-9b75e42e5ce0',
	username: '',
	location: null
});