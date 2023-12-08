<script lang="ts">
    //amongus
    import {dateValue} from '$lib/dateStore';
    import {floorid} from '$lib/floorStore';

    import {CachePolicy} from '$houdini';
    import {getModalStore, type ModalSettings} from '@skeletonlabs/skeleton';
    import {getDesks} from '$lib/queries/deskQueries';
    import {refreshDesks} from "$lib/refreshStore";
    import * as events from "events";

    const modalStore = getModalStore();

    const modal: ModalSettings = {
        type: 'component',
        component: 'modalBooking',
        response: () => {
            $dateValue = new Date().toISOString().split('T')[0];
        }
    };


    // test data
    const selectedUsers = ["Maximilian", "Hugo", "Alina"]
    let selectedDesks: any[] = [];

    // $: if (selectedDesks) {
    //     $refreshDesks = !$refreshDesks;
    // }

    function handleClick(event, desk) {
        if (selectedDesks.includes(desk)) {
            selectedDesks.splice(selectedDesks.indexOf(desk), 1)
            event.target.classList.toggle('selected');
        } else if (selectedDesks.length === selectedUsers.length) {
            alert("Too Many Desks Selected!");
        } else {
            selectedDesks.push(desk)
            event.target.classList.toggle('selected');
        }
        selectedDesks = selectedDesks
    }
</script>

<a class="btn variant-filled-primary" href="./login">Login</a>

<div>
    {selectedUsers}
</div>

<div class="grid grid-rows-2">
    {#key $refreshDesks}
        <div class="grid grid-cols-5 gap-2">
            {#await getDesks.fetch({policy: CachePolicy.NetworkOnly, variables: {floorid: $floorid}})}
                <p>loading desks...</p>
            {:then fetched}
                {#each fetched?.data?.getDesksOnFloor ?? [] as desk}
                    <button
                            on:click={(e) => handleClick(e, desk)}
                            class="btn variant-filled-success"
                            class:variant-ghost={selectedDesks.includes(desk)}
                            class:variant-filled-error={desk?.bookings?.find((b) => b?.date === $dateValue)}
                    >{desk?.desknum}</button>
                {/each}
            {/await}
        </div>
    {/key}
</div>

<div>
    <button class="btn variant-filled-primary"
            on:click={() => {
                if (selectedUsers.length === selectedDesks.length) {
                    console.log(selectedUsers)
                    console.log(selectedDesks)
                }
			}}
            disabled="{selectedDesks.length !== selectedUsers.length}"
    >Book
    <button>
</div>
