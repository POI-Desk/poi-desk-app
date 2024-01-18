import { graphql } from '$houdini';

export const getBuildings = graphql(`
	query getBuildingsInLocation($locationid: ID!) {
		getBuildingsInLocation(locationid: $locationid) {
			pk_buildingid
			buildingname
		}
	}
`);
