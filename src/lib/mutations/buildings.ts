import { graphql } from '$houdini';

export const addBuilding = graphql(`
	mutation addBuilding($name: String!, $locationid: ID!) {
		addBuilding(name: $name, locationid: $locationid) {
			pk_buildingid,
            buildingname
		}
	}
`);

export const deleteBuilding = graphql(`
	mutation deleteBuilding($id: ID!) {
		deleteBuilding(id: $id) {
			pk_buildingid,
			buildingname
		}
	}
`);

export const changeNameOfBuilding = graphql(`
	mutation changeNameOfBuilding($id: ID!, $newName: String!) {
		changeNameOfBuilding(id: $id, newName: $newName) {
			pk_buildingid,
			buildingname
		}
	}
`)