import { defaultMapProps } from '$lib/map/props';
import type { MapTransform } from '$lib/types/mapTypes';
import { writable } from 'svelte/store';

export const map = writable<MapTransform>({
	height: defaultMapProps.height,
	width: defaultMapProps.width,
	scale: 1
});
