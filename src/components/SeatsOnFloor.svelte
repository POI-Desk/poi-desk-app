<script lang="ts">
    import {graphql} from "$houdini";
    import Booking from "$components/Booking.svelte";
    import CrazyAnimation from "$components/CrazyAnimation.svelte";
    import Check from "$components/Check.svelte";

    let floorid = "5c36ec41-e3b0-40dc-b755-e2251b08010e";
    export let dateValue: string;
    let curSeatId: string;
    let curDayTime: string;
    let showModal: boolean = false;
    let selectedSeat;
    let visible: boolean = false;

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

    function toggleModal(seat) {
        showModal = !showModal;
        selectedSeat = seat;
    }

    function spinnnnn() {
        visible = true;
        setTimeout(() => {
            visible = false;
        }, 5000);
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
        <button on:click={() => toggleModal(seatz)}
                class="btn btn-accent"
                class:btn-error={seat?.bookings?.find(b => b?.date === dateValue)}
        >{seat?.seatnum}</button>
    {/each}
{:else}
    <p>can't find seats</p>
{/if}

{#if showModal}
    <Booking date={new Date(dateValue)} seat={selectedSeat} on:close={toggleModal} on:play={spinnnnn} />
{/if}

{#if visible}
    <CrazyAnimation>
        <Check />
    </CrazyAnimation>

{/if}
