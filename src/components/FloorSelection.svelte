<script lang="ts">
    import {getContext, setContext} from "svelte";
    import {floorid, getFloors} from "$lib/floorStore";
    import {buildingid} from "$lib/buildingStore";

    // export let floorid = "";
    // let buildingid = "";

    const {getSeats}: any = getContext('seats');


    $: floors = $getFloors.data?.getFloorsInBuilding;


    async function selectFirstFloor() {
        await getFloors.fetch({variables: {buildingid: $buildingid}});

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
        {#await getFloors.fetch({variables: {buildingid: $buildingid}})}
            <p>loading seats...</p>
        {:then fetched}
            {#each fetched.data?.getFloorsInBuilding ?? [] as floor}
                <button class="btn btn-primary"
                        on:click={() => {$floorid = floor?.pk_floorid ?? ""}}
                >{floor?.floorname}</button>
            {/each}
        {/await}
    </div>
</div>

