import { fragment, graphql } from '$houdini';

export const createMap = graphql(`
	mutation createMap($floorId: ID!, $mapInput: MapInput!) {
		createMap(floorId: $floorId, mapInput: $mapInput) {
			pk_mapId
			width
			height
		}
	}
`);

export const updateMap = graphql(`
  mutation updateMap($mapId: ID!, $mapInput: MapInput!) {
    updateMap(mapId: $mapId, mapInput: $mapInput) {
      pk_mapId
      width
      height
    }
  }
`);