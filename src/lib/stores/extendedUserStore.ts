import { writable } from "svelte/store";
import type {User} from "$lib/types/userTypes";
import type {Desk} from "$lib/types/deskTypes";

export const selectedUsers = writable<User[]> ();

export const selectedDesks = writable<Desk[]> ()
