<!--OBSOLETE-->

<!--<script lang="ts">-->
<!--    import {dateValue} from '$lib/dateStore';-->
<!--    import {floorid} from '$lib/floorStore';-->

<!--    import {CachePolicy} from '$houdini';-->
<!--    import {getDesks} from '$lib/queries/deskQueries';-->
<!--    import {refreshDesks} from "$lib/refreshStore";-->
<!--    import {selectedDesks, selectedUsers} from "$lib/stores/extendedUserStore";-->
<!--    import {interval} from "$lib/bookingStore";-->
<!--    import type {Desk} from "$lib/types/deskTypes";-->
<!--    import {buildingid} from "$lib/buildingStore";-->


<!--    $selectedDesks = [];-->

<!--    $: if ($buildingid || $floorid) {-->
<!--        $selectedDesks = [];-->
<!--    }-->


<!--    function handleDeskSelection(desk: Desk) {-->
<!--        if (desk?.bookings?.find((b) => {-->
<!--            return evaluateBookings(b);-->
<!--        })) {-->
<!--            alert("This desk is already booked!");-->
<!--            return;-->
<!--        }-->
<!--        if ($selectedDesks.includes(desk)) {-->
<!--            $selectedDesks.splice($selectedDesks.indexOf(desk), 1)-->
<!--        } else if ($selectedDesks.length === $selectedUsers.length) {-->
<!--            alert("Too Many Desks Selected!");-->
<!--        } else {-->
<!--            $selectedDesks.push(desk);-->
<!--        }-->
<!--        $selectedDesks = $selectedDesks;-->
<!--    }-->

<!--    function evaluateBookings(b: any) {-->
<!--        if (b?.date !== $dateValue) return false;-->
<!--        return ($interval.morning && b?.ismorning) || ($interval.afternoon && b?.isafternoon);-->
<!--    }-->
<!--</script>-->

<!--ACHTUNG USER SIND NOCH STATISCH-->

<!--<div class="grid grid-rows-2">-->
<!--    {#key $refreshDesks}-->
<!--        <div class="grid grid-cols-5 gap-2">-->
<!--            {#await getDesks.fetch({policy: CachePolicy.NetworkOnly, variables: {floorid: $floorid}})}-->
<!--                <p>loading desks...</p>-->
<!--            {:then fetched}-->
<!--                {#each fetched?.data?.getDesksOnFloor ?? [] as desk}-->
<!--                    <button-->
<!--                            on:click={() => handleDeskSelection(desk)}-->
<!--                            s                            class:variant-filled-error={desk?.bookings?.find((b) => { if ($interval || $dateValue) {return evaluateBookings(b)} })}-->
<!--                            disabled="{desk?.bookings?.find((b) => { if ($interval || $dateValue) {return evaluateBookings(b)} })}"-->
<!--                    >{desk?.desknum}</button>-->
<!--                {/each}-->
<!--            {/await}-->
<!--        </div>-->
<!--    {/key}-->
<!--</div>-->
