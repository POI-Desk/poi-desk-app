<script lang="ts">
    import {dateValue} from '$lib/dateStore';
    import {floorid} from '$lib/floorStore';

    import {CachePolicy} from '$houdini';
    import {getModalStore, type ModalSettings} from '@skeletonlabs/skeleton';
    import {getDesks} from '$lib/queries/deskQueries';
    import {refreshDesks} from "$lib/refreshStore";
    import {selectedDesks, selectedUsers} from "$lib/stores/extendedUserStore";
    import {interval} from "$lib/bookingStore";
    import type {Desk} from "$lib/types/deskTypes";
    import {buildingid} from "$lib/buildingStore";

    const modalStore = getModalStore();

    $selectedDesks = [];

    $: if ($buildingid || $floorid) {
        $selectedDesks = [];
    }

    // --- test data
    // todo change
    $selectedUsers = [{
        pk_userid: "189c9268-8f89-417e-ae47-ce87c2f4acc3",
        username: "Alina",
        location: {
            pk_locationid: "",
            locationname: ""
        },
        userInfo: ""
    }, {
        pk_userid: "8ad4479e-5901-4cac-8f28-75e7e28c1ab2",
        username: "Markus",
        location: {
            pk_locationid: "",
            locationname: ""
        },
        userInfo: ""
    }, {
        pk_userid: "3bf02676-fb27-4925-b0e6-c80283a903bd",
        username: "Jupp",
        location: {
            pk_locationid: "",
            locationname: ""
        },
        userInfo: ""
    }]
    // -----

    const modal: ModalSettings = {
        type: 'component',
        component: 'modalExtendedBooking',
        response: () => {
            $dateValue = new Date().toISOString().split('T')[0];
        }
    };

    function handleDeskSelection(desk: Desk) {
        if (desk?.bookings?.find((b) => {
            return evaluateBookings(b);
        })) {
            alert("This desk is already booked!");
            return;
        }
        if ($selectedDesks.includes(desk)) {
            $selectedDesks.splice($selectedDesks.indexOf(desk), 1)
        } else if ($selectedDesks.length === $selectedUsers.length) {
            alert("Too Many Desks Selected!");
        } else {
            $selectedDesks.push(desk);
        }
        $selectedDesks = $selectedDesks;
    }

    function evaluateBookings(b: any) {
        if (b?.date !== $dateValue) return false;
        return ($interval.morning && b?.ismorning) || ($interval.afternoon && b?.isafternoon);
    }
</script>

ACHTUNG USER SIND NOCH STATISCH

<div class="grid grid-rows-2">
    {#key $refreshDesks}
        <div class="grid grid-cols-5 gap-2">
            {#await getDesks.fetch({policy: CachePolicy.NetworkOnly, variables: {floorid: $floorid}})}
                <p>loading desks...</p>
            {:then fetched}
                {#each fetched?.data?.getDesksOnFloor ?? [] as desk}
                    <button
                            on:click={() => handleDeskSelection(desk)}
                            class="btn variant-filled-success"
                            class:variant-ghost={$selectedDesks.includes(desk)}
                            class:variant-filled-error={desk?.bookings?.find((b) => { if ($interval || $dateValue) {return evaluateBookings(b)} })}
                            disabled="{desk?.bookings?.find((b) => { if ($interval || $dateValue) {return evaluateBookings(b)} })}"
                    >{desk?.desknum}</button>
                {/each}
            {/await}
        </div>
    {/key}
</div>

<!--    	Extended Booking Test-->
<button on:click={() => {
                if ($selectedUsers.length === $selectedDesks.length && ($interval.morning || $interval.afternoon)) {
                    modalStore.trigger(modal);
                }
            }}
        class="btn variant-filled-primary"
        disabled="{$selectedDesks.length !== $selectedUsers.length || !($interval.morning || $interval.afternoon)}"
>Book
</button>
<!--    -->


