import { graphql } from '$houdini';

export const getLocations = graphql(`
	query getLocations {
		getAllLocations {
			locationname,
			pklocationid
			buildings {
				buildingname
			}
		}
	}
`);
