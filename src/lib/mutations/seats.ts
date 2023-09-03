import { graphql } from '$houdini';

export const addSeatsToFloor = graphql(`
    mutation AddSeatToFloor($floorid: ID!, $seats: [Seatinput]!){
        addSeatsToFloor(floorid: $floorid, seats: $seats){
            pk_seatid
        }
    }
`);