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
        pk_userid: "85d4c824-5599-40ad-834d-575355d7f0b3",
        username: "Alina",
        location: {
            pk_locationid: "",
            locationname: ""
        },
        userInfo: ""
    }, {
        pk_userid: "19073632-9d70-4f07-8b23-9d1b9500d1aa",
        username: "Markus",
        location: {
            pk_locationid: "",
            locationname: ""
        },
        userInfo: ""
    }, {
        pk_userid: "8085696c-fd06-47d7-9cca-84a309d22547",
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


