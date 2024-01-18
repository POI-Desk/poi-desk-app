import { graphql } from "$houdini";

export const updateWallsOnMap = graphql(`
  mutation UpdateWallsOnMap($mapId: ID!, $wallInputs: [UpdateWallInput!]!) {
    updateWallsOnMap(mapId: $mapId, wallInputs: $wallInputs) {
      pk_wallId
    }
  }
`);

export const deleteWalls = graphql(`
  mutation DeleteWalls($wallIds: [ID!]!){
    deleteWalls(wallIds: $wallIds){
      pk_wallId
    }
  }
`);