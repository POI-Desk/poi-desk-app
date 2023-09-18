import { graphql } from '$houdini';

export const addDesksToFloor = graphql(`
	mutation AddDesksToFloor($floorid: ID!, $desks: [Deskinput!]!) {
		addDesksToFloor(floorid: $floorid, desks: $desks) {
			pk_deskid
		}
	}
`);
