<script lang="ts">
    import {CachePolicy, graphql} from "$houdini";
    import Booking from "$components/Booking.svelte";
    import CrazyAnimation from "$components/CrazyAnimation.svelte";
    import Check from "$components/Check.svelte";
    import FloorSelection from "$components/FloorSelection.svelte";
    import {setContext} from "svelte";
    import {floorid} from "$lib/floorStore";
    import BuildingSelection from "$components/BuildingSelection.svelte";
    import { dateValue } from "$lib/dateStore";

    let showModal: boolean = false;
    let selectedSeat: any;
    let visible: boolean = false;

    export const _getSeatsOnFloorVariables = () => {
        return $floorid;
    }

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

    // $: seats = $getSeats.data?.getSeatsOnFloor;


    function toggleModal(seat: any) {
        showModal = !showModal;
        selectedSeat = seat;
    }

    function spinnnnn() {
        visible = true;
        setTimeout(() => {
            visible = false;
        }, 5000);
    }

    setContext('seats', {getSeats});
</script>


<div class="grid grid-rows-2">
    <FloorSelection></FloorSelection>

    <div class="grid grid-cols-5 gap-2">
        {#await getSeats.fetch({variables: {floorid: $floorid}})}
            <p>loading seats...</p>
        {:then fetched}
            {#each fetched?.data?.getSeatsOnFloor ?? [] as seat}
                <button on:click={() => toggleModal(seat)}
                        class="btn btn-accent"
                        class:btn-error={seat?.bookings?.find(b => b?.date === dateValue)}
                >{seat?.seatnum}</button>
            {/each}
        {/await}

    </div>
</div>

{#if showModal}
    <Booking date={new Date($dateValue)} seat={selectedSeat} on:close={() => {
        toggleModal(null);
        getSeats.fetch({policy: CachePolicy.NetworkOnly});
    }} on:play={spinnnnn}/>
{/if}

{#if visible}
    <CrazyAnimation>
        <Check/>
    </CrazyAnimation>
{/if}


<div class="flex justify-center">
    <div class="absolute bottom-20">
        <BuildingSelection></BuildingSelection>
    </div>
</div>
