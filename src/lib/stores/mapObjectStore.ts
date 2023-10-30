import type { MapObject } from "$lib/types/mapObjectTypes";
import type { TransformType } from "$lib/types/transformType";
import { writable } from "svelte/store";

export const allMapObjects = writable<MapObject[]>([]);

export const selectedMapObject = writable<MapObject | null>(null);