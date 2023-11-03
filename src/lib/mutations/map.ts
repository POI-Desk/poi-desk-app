import { graphql } from '$houdini';

export const createMap = graphql(`
	mutation CreateMap($floorId: ID!, $mapInput: MapInput!) {
		createMap(floorId: $floorId, mapInput: $mapInput) {
			pk_mapId
			width
			height
		}
	}
`);
