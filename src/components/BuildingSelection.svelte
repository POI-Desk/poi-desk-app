<script lang="ts">
    import {graphql} from "$houdini";
    import {location} from "$lib/locationStore";
    import {getContext} from "svelte";

    // let floorid = "5c36ec41-e3b0-40dc-b755-e2251b08010e";
    let locationId = $location?.locationId;
    export let buildingId = '';
    const { getFloors } = getContext('floors');


    export const _getBuildingsInLocationVariables = () => {
        return { locationId };
    }

    const getBuildings = graphql(`
        query getBuildingsInLocation($locationId: ID!) @load {
            getBuildingsInLocation (locationId: $locationId) {
                pk_buildingid
                buildingname
            }
        }
    `);

    $: buildings = $getBuildings.data?.getBuildingsInLocation;

    // function onFloorClicked(newFloorId: string) {
    //     floorid = newFloorId;
    //     getSeats.fetch({variables: {floorid}});
    // }
    function onBuildingClicked(newBuildingId: string) {
        buildingId = newBuildingId;
        getFloors.fetch({variables: {buildingId}});
    }
</script>

<div class="btn-group btn-group-vertical">
    {#if $getBuildings.fetching}
        <p>loading buildings...</p>
    {:else if buildings}
        {#each buildings as building}
            <button class="btn btn-primary"
                    on:click={() => onBuildingClicked(building?.pk_buildingid ?? "")}
            >{building?.buildingname}</button>
        {/each}
    {/if}
</div>
