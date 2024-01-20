import { graphql } from '$houdini';

export const addLocation = graphql(`
	mutation addLocation($name: String!) {
		addLocation(name: $name) {
			pk_locationid,
            locationname
		}
	}
`);