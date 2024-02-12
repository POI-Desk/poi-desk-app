import { graphql } from '$houdini';

export const getBuildings = graphql(`
	query getBuildingsInLocation($locationid: ID!) {
		getBuildingsInLocation(locationid: $locationid) {
			pk_buildingid
			buildingname
		}
	}
`);


export const getBuildingsWithFloors = graphql(`
	query GetBuildingsinLocationWithFloors($locationid: ID!) {
		getBuildingsInLocation(locationid: $locationid) {
			pk_buildingid
			buildingname
			floors {
				pk_floorid
				floorname
			}
		}
	}
`);