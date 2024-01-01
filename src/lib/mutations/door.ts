import { graphql } from "$houdini";

export const updateDoorsOnMap = graphql(`
  mutation UpdateDoorsOnMap($mapId: ID!, $doorInputs: [UpdateDoorInput!]!) {
    updateDoorsOnMap(mapId: $mapId, doorInputs: $doorInputs) {
      pk_doorId
    }
  }
`);

export const deleteDoors = graphql(`
  mutation DeleteDoors($doorIds: [ID!]!){
    deleteDoors(doorIds: $doorIds){
      pk_doorId
    }
  }
`);