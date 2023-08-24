<script>

    import {graphql} from "$houdini";

    let floorid = "5c36ec41-e3b0-40dc-b755-e2251b08010e";

    export const _getSeatsOnFloorVariables = () => {
        return {floorid}
    }

    const getSeats = graphql(`
        query getSeatsOnFloor($floorid: ID!) @load {
            getSeatsOnFloor(floorid: $floorid) {
                pk_seatid
                seatnum
                x
                y
            }
           }
        `);

    $: seats = $getSeats.data?.getSeatsOnFloor;

    const onClick = () => {
        getSeats.fetch({variables: { floorid }})
    }
</script>
{#if $getSeats.fetching}
    <p>loading...</p>
{:else if seats}
    {#each seats as seat}
        <p>{seat?.seatnum}</p>
    {/each}
{:else}
    <p>can't find seats</p>
{/if}


<div>
    <!--    <button on:click={onFloorClicked()}>Gebäude A</button>-->
    <input type="text" bind:value={floorid}>
</div>
