import { graphql } from '$houdini';

export const addBuilding = graphql(`
	mutation addBuilding($name: String!, $locationid: ID!) {
		addBuilding(name: $name, locationid: $locationid) {
			pk_buildingid,
            buildingname
		}
	}
`);