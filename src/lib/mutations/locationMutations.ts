import { graphql } from '$houdini';

export const addLocation = graphql(`
	mutation addLocation($name: String!) {
		addLocation(name: $name) {
			pklocationid,
            locationname
		}
	}
`);

export const deleteLocation = graphql(`
	mutation deleteLocation($id: ID!) {
		deleteLocation(id: $id) {
			pklocationid,
			locationname
		}
	}
`);

export const changeNameOfLocation = graphql(`
	mutation changeNameOfLocation($id: ID!, $newName: String!) {
		changeNameOfLocation(id: $id, newName: $newName) {
			pklocationid,
			locationname
		}
	}
`)