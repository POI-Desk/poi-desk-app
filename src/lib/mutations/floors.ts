import { graphql } from '$houdini';

export const addFloor = graphql(`
	mutation addFloor($name: String!, $buildingid: ID!) {
		addFloor(name: $name, buildingid: $buildingid) {
			pk_floorid,
            floorname
		}
	}
`);

export const deleteFloor = graphql(`
	mutation deleteFloor($id: ID!) {
		deleteFloor(id: $id) {
			pk_floorid,
			floorname
		}
	}
`);