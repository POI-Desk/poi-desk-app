import { graphql } from '$houdini';

export const addLocation = graphql(`
	mutation addLocation($name: String!, $id: ID) {
		addLocation(name: $name, id: $id) {
			pk_locationid,
            locationname
		}
	}
`);

export const deleteLocation = graphql(`
	mutation deleteLocation($id: ID!) {
		deleteLocation(id: $id) {
			pk_locationid,
			locationname
		}
	}
`)