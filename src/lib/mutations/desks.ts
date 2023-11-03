import { graphql } from '$houdini';

export const addDesksToFloor = graphql(`
	mutation AddDesksToFloor($floorId: ID!, $mapId: ID!, $desks: [DeskInput!]!) {
		addDesksToFloor(floorId: $floorId, mapId: $mapId, desks: $desks) {
			pk_deskid
		}
	}
`);
