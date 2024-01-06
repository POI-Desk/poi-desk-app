import {graphql} from "$houdini";

export const _getBuildingsInLocationVariables = () => {
    return {};
};

export const getBuildings = graphql(`
    query getBuildingsInLocation($locationid: ID!) @load {
        getBuildingsInLocation(locationid: $locationid) {
            pk_buildingid
            buildingname
        }
    }
`);