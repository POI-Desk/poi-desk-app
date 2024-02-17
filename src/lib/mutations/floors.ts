import { graphql } from '$houdini';

export const addFloor = graphql(`
	mutation addFloor($name: String!, $buildingid: ID!) {
		addFloor(name: $name, buildingid: $buildingid) {
			pk_floorid,
            floorname
		}
	}
`);