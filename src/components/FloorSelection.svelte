<script lang="ts">
    import {graphql} from "$houdini";
    import {getContext, setContext} from "svelte";
    import BuildingSelection from "$components/BuildingSelection.svelte";
    import {floorid} from "$lib/floorStore";

    // export let floorid = "";
    let buildingId = "";

    const { getSeats } : any = getContext('seats');


    export const _getFloorsInBuildingVariables = () => {
        return { buildingId };
    }

    const getFloors = graphql(`
        query getFloorsInBuilding($buildingId: ID!) @load {
            getFloorsInBuilding(buildingId: $buildingId) {
                pk_floorid
                floorname
            }
        }
    `);


    $: floors = $getFloors.data?.getFloorsInBuilding;


    $: {
        if ($floorid) {
            getSeats.fetch({ variables: { floorid: $floorid } });
        }
    }

    setContext('floors', { getFloors });
</script>


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

<BuildingSelection {buildingId}></BuildingSelection>
