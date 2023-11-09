import { graphql } from '$houdini';

export const addDesksToFloor = graphql(`
	mutation AddDesksToFloor($floorId: ID!, $mapId: ID!, $desks: [DeskInput!]!) {
		addDesksToFloor(floorId: $floorId, mapId: $mapId, desks: $desks) {
			pk_deskid
		}
	}
`);

export const updateDesksOnMap = graphql(`
  mutation UpdateDesksOnMap($mapId: ID!, $deskInputs: [UpdateDeskInput!]!) {
    updateDesksOnMap(mapId: $mapId, deskInputs: $deskInputs) {
      pk_deskid
    }
  }
`);

export const deleteDesks = graphql(`
  mutation DeleteDesks($deskIds: [ID!]!){
    deleteDesks(deskIds: $deskIds){
      pk_deskid
    }
  }
`);