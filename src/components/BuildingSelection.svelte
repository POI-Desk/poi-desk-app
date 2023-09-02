<script lang="ts">
    import {graphql} from "$houdini";
    import {location} from "$lib/locationStore";
    import {getContext, onMount} from "svelte";
    import {buildingid} from "$lib/buildingStore";

    $: locationid = $location?.pk_locationid;
    // export let buildingid = "";
    const {getFloors}: any = getContext("floors");

    export const _getBuildingsInLocationVariables = () => {
        return {locationid};
    }

    const getBuildings = graphql(`
        query getBuildingsInLocation($locationid: ID!) @load {
            getBuildingsInLocation(locationid: $locationid) {
                pk_buildingid
                buildingname
            }
        }
    `);

    $: buildings = $getBuildings.data?.getBuildingsInLocation;

    onMount(() => {
        selectFirstBuilding();
    })

    async function selectFirstBuilding() {
        await getBuildings.fetch({variables: {locationid}});

        if (buildings) {
            $buildingid = buildings[0]?.pk_buildingid || ""; // Set to the first building
        }
    }


    $: {
        if ($buildingid) {
            getFloors.fetch({variables: {buildingid: $buildingid}});
        }
    }
</script>

<div class="btn-group btn-group-horizontal">
    {#if $getBuildings.fetching}
        <p>loading buildings...</p>
    {:else if buildings}
        {#each buildings as building}
            <button
                    class="btn btn-primary"
                    on:click={() => {
                    $buildingid = building?.pk_buildingid ?? "";
                }}
            >
                {building?.buildingname}
            </button>
        {/each}
    {/if}
</div>
