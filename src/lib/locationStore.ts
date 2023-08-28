import {writable} from "svelte/store";
import type {Location} from "$lib/types/locationType";

export const location = writable<Location>({
    pk_locationid: "2c628849-b7ad-4df7-be24-19c483f7e4f1", // for test purposes
    locationname: "Wien"
});