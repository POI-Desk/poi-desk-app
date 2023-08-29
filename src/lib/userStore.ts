import { writable } from "svelte/store";
import type { User } from "./types/userTypes";

export const user = writable<User> ({
    pk_userId: '',
    username: ''
});