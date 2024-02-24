import { fragment, graphql } from '$houdini';

export const updateMap = graphql(`
  mutation updateMap($mapId: ID!, $mapInput: MapInput!) {
    updateMap(mapId: $mapId, mapInput: $mapInput) {
      pk_mapId
      width
      height
    }
  }
`);

export const deleteMap = graphql(`
  mutation deleteMap($mapId: ID!){
    deleteMap(mapId: $mapId)
  }
`);