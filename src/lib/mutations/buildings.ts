import { graphql } from '$houdini';

export const addBuilding = graphql(`
	mutation addBuilding($name: String!) {
		addBuilding(name: $name) {
			pk_buildingid,
            buildingname
		}
	}
`);