import { graphql } from '$houdini';

export const _getFloorsInBuildingVariables = () => {
	return {};
};

export const getFloors = graphql(`
	query getFloorsInBuilding($buildingid: ID!) @load {
		getFloorsInBuilding(buildingid: $buildingid) {
			pk_floorid
			floorname
		}
	}
`);

export const getAllLocations = graphql(`
	query getAllLocations {
		getAllLocations {
			pk_locationid
			locationname
		}
	}
`);
