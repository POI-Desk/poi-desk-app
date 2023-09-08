<script lang="ts">
    import {graphql} from "$houdini";
    import {getContext, setContext} from "svelte";
    import BuildingSelection from "$components/BuildingSelection.svelte";
    import {floorid} from "$lib/floorStore";
    import {buildingid} from "$lib/buildingStore";

    // export let floorid = "";
    // let buildingid = "";

    const {getSeats}: any = getContext('seats');


    export const _getFloorsInBuildingVariables = () => {
        return {$buildingid};
    }

    const getFloors = graphql(`
        query getFloorsInBuilding($buildingid: ID!) @load {
            getFloorsInBuilding(buildingid: $buildingid) {
                pk_floorid
                floorname
            }
        }
    `);


    $: floors = $getFloors.data?.getFloorsInBuilding;


    async function selectFirstFloor() {
        await getFloors.fetch({ variables: { buildingid: $buildingid } });

        if (floors) {
            $floorid = floors[0]?.pk_floorid || ""; // Set to the first floor
        }
    }

    $: {
        if ($buildingid) selectFirstFloor();
    }


    $: {
        if ($floorid) {
            getSeats.fetch({variables: {floorid: $floorid}});
        }
    }


    setContext('floors', {getFloors});
</script>

<div class="flex items-center">
        <div class="btn-group btn-group-vertical">
            {#if $getFloors.fetching}
                <p>loading seats...</p>
            {:else if floors}
                {#each floors as floor}
                    <button class="btn btn-primary"
                            on:click={() => {$floorid = floor?.pk_floorid ?? ""}}
                    >{floor?.floorname}</button>
                {/each}
            {/if}
        </div>
</div>

<div class="flex justify-center">
    <div class="absolute bottom-20">
        <BuildingSelection {buildingid}></BuildingSelection>
    </div>
</div>
