import {writable} from "svelte/store";
import {graphql} from "$houdini";

export const floorid = writable("");

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