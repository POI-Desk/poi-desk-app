import { graphql } from '$houdini';

export const addDesksToFloor = graphql(`
	mutation AddSeatsToFloor($floorid: ID!, $desks: [Seatinput]!) {
		addSeatsToFloor(floorid: $floorid, desks: $desks) {
			pk_seatid
		}
	}
`);
