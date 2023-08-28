<script lang="ts">
    import {graphql} from "$houdini";
    import {getContext, setContext} from "svelte";
    import BuildingSelection from "$components/BuildingSelection.svelte";

    export let floorid: string;
    let buildingId: string = "5b503aa3-0163-4b86-b7e2-edcc1acbc211"; // default value

    const { getSeats } = getContext('seats');


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

    function onFloorClicked(newFloorId: string) {
        floorid = newFloorId;
        getSeats.fetch({variables: {floorid}});
    }

    setContext('floors', { getFloors });

</script>


<div class="btn-group btn-group-vertical float-left">
    {#if $getFloors.fetching}
        <p>loading seats...</p>
    {:else if floors}
        {#each floors as floor}
            <button class="btn btn-primary"
                    on:click={() => onFloorClicked(floor?.pk_floorid ?? "")}>{floor?.floorname}</button>
        {/each}
    {/if}
</div>

<BuildingSelection {buildingId}></BuildingSelection>
