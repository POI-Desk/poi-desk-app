import {writable} from "svelte/store";
import type {Location} from "$lib/types/locationType";

export const location = writable<Location>({
    pk_locationid: "",
    locationname: ""
});