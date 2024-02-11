import type { Floor } from '$lib/types/floorType';
export type Building = {
	buildingid: string;
	buildingname: string;
	floors: Floor[];
};
