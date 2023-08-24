<script lang="ts">
    import {graphql} from "$houdini";

    let floorid = "5c36ec41-e3b0-40dc-b755-e2251b08010e";
    export let dateValue: string;
    let curSeatId: string;
    let curDayTime: string;

    export const _getSeatsOnFloorVariables = () => {
        return {floorid};
    }

    export const _isBookedAtVariables = () => {
        return {curSeatId, dateValue, curDayTime}
    }

    const getFloors = graphql(`
        query getAllFloors @load {
            getAllFloors {
                pk_floorid
                floorname
            }
        }
    `);

    const getSeats = graphql(`
        query getSeatsOnFloor($floorid: ID!) @load {
            getSeatsOnFloor(floorid: $floorid) {
                pk_seatid
                seatnum
                x
                y
                bookings {
                    user {
                        pk_userid
                    }
                    date
                }
            }
           }
        `);

    $: seats = $getSeats.data?.getSeatsOnFloor;
    $: floors = $getFloors.data?.getAllFloors;

    function onFloorClicked(newFloorId: string) {
        floorid = newFloorId;
        getSeats.fetch({variables: {floorid}});
    }
</script>

<div class="btn-group btn-group-vertical">
    {#if $getFloors.fetching}
        <p>loading seats...</p>
    {:else if floors}
        {#each floors as floor}
            <button class="btn btn-primary"
                    on:click={() => onFloorClicked(floor?.pk_floorid ?? "")}>{floor?.floorname}</button>
        {/each}
    {/if}
</div>

{#if $getSeats.fetching}
    <p>loading seats...</p>
{:else if seats}
    {#each seats as seat}
        <button class="btn btn-accent" class:btn-error={seat?.bookings?.find(b => b?.date === dateValue)}
        >{seat?.seatnum}</button>
    {/each}
{:else}
    <p>can't find seats</p>
{/if}
