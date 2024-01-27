import { graphql } from '$houdini';

export const getLocations = graphql(`
	query getLocations {
		getAllLocations {
			locationname,
			pk_locationid
			buildings {
				buildingname
			}
		}
	}
`);
