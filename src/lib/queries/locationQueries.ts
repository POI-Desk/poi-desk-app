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

export const getAdminsOfLocation = graphql(`
	query getAdminsOfLocation($locationid: ID!) {
		getAdminsOfLocation(locationid: $locationid) {
			pk_userid
			username
		}
	}
`);
