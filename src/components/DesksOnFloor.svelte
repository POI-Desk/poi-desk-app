<script lang="ts">
    import {CachePolicy} from '$houdini';
    import Booking from '$components/Booking.svelte';
    import CrazyAnimation from '$components/CrazyAnimation.svelte';
    import Check from '$components/Check.svelte';
    import FloorSelection from '$components/FloorSelection.svelte';
    import {floorid} from '$lib/floorStore';
    import BuildingSelection from '$components/BuildingSelection.svelte';
    import {dateValue} from '$lib/dateStore';
    import {getDesks} from '$lib/deskStore';
    import {invalidate} from "$app/navigation";
    import {onMount} from "svelte";

    let showModal: boolean = false;
    let selectedDesk: any;
    let visible: boolean = false;
    let onClose: boolean = false;

    function toggleModal(desk: any) {
        showModal = !showModal;
        selectedDesk = desk;
    }

    function confirm() {
        visible = true;
        setTimeout(() => {
            visible = false;
        }, 500);
    }

</script>

<div class="grid grid-rows-2">
    <FloorSelection/>

    <div class="grid grid-cols-5 gap-2">
        {#key onClose}
            {#await getDesks.fetch({variables: {floorid: $floorid}})}
                <p>loading desks...</p>
            {:then fetched}
                {#each fetched?.data?.getDesksOnFloor ?? [] as desk}
                    <button
                            on:click={() => toggleModal(desk)}
                            class="btn variant-filled-success"
                            class:variant-filled-error={desk?.bookings?.find((b) => b?.date === $dateValue)}
                    >{desk?.desknum}</button
                    >
                {/each}
            {/await}
        {/key}
    </div>
</div>

{#if showModal}
    <Booking
            date={new Date($dateValue)}
            desk={selectedDesk}
            on:close={() => {
                getDesks.fetch({ policy: CachePolicy.NetworkOnly }).then(() => {
                        invalidate(() => true);
                        onClose = !onClose;
                    }
                );
                toggleModal(null);
		    }}
            on:play={confirm}
    />
{/if}

{#if visible}
    <CrazyAnimation>
        <Check/>
    </CrazyAnimation>
{/if}

<div class="flex justify-center">
    <div class="absolute bottom-20">
        <BuildingSelection/>
    </div>
</div>
