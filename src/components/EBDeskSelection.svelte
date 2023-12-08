<script lang="ts">
    //amongus
    import {dateValue} from '$lib/dateStore';
    import {floorid} from '$lib/floorStore';

    import {CachePolicy} from '$houdini';
    import {getModalStore, type ModalSettings} from '@skeletonlabs/skeleton';
    import {getDesks} from '$lib/queries/deskQueries';
    import {refreshDesks} from "$lib/refreshStore";
    import {selectedDesks, selectedUsers} from "$lib/stores/extendedUserStore";

    const modalStore = getModalStore();

    $selectedDesks = [];

    // --- test data
    // todo change
    $selectedUsers = [{
        pk_userid: "25a324e4-3317-46c2-8d59-228e1745589d",
        username: "Alina",
        location: {
            pk_locationid: "",
            locationname: ""
        },
        userInfo: ""
    }, {
        pk_userid: "1adcade1-665d-43ca-b7c7-356f5e31a481",
        username: "Markus",
        location: {
            pk_locationid: "",
            locationname: ""
        },
        userInfo: ""
    }, {
        pk_userid: "0af2f8cb-8cb6-40c4-8b52-32b63748151e",
        username: "Jupp",
        location: {
            pk_locationid: "",
            locationname: ""
        },
        userInfo: ""}]
    // -----

    const modal: ModalSettings = {
        type: 'component',
        component: 'modalExtendedBooking',
        response: () => {
            $dateValue = new Date().toISOString().split('T')[0];
        }
    };


    // $: if (selectedDesks) {
    //     $refreshDesks = !$refreshDesks;
    // }

    function handleClick(event, desk) {
        if ($selectedDesks.includes(desk)) {
            $selectedDesks.splice($selectedDesks.indexOf(desk), 1)
            event.target.classList.toggle('selected');
        } else if ($selectedDesks.length === $selectedUsers.length) {
            alert("Too Many Desks Selected!");
        } else {
            $selectedDesks.push(desk)
            event.target.classList.toggle('selected');
        }
        $selectedDesks = $selectedDesks
    }
</script>

<a class="btn variant-filled-primary" href="./login">Login</a>

<div>
    {$selectedUsers}
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
                            class:variant-ghost={$selectedDesks.includes(desk)}
                            class:variant-filled-error={desk?.bookings?.find((b) => b?.date === $dateValue)}
                    >{desk?.desknum}</button>
                {/each}
            {/await}
        </div>
    {/key}
</div>

<!--<div>-->
<!--    <button class="btn variant-filled-primary"-->
<!--            on:click={() => {-->
<!--                if (selectedUsers.length === selectedDesks.length) {-->
<!--                    console.log(selectedUsers)-->
<!--                    console.log(selectedDesks)-->
<!--                }-->
<!--			}}-->
<!--            disabled="{selectedDesks.length !== selectedUsers.length}"-->
<!--    >Book-->
<!--    </button>-->
<!--</div>-->


<!--    	Extended Booking Test-->
<button on:click={() => {
                if ($selectedUsers.length === $selectedDesks.length) {
                    modalStore.trigger(modal);
                }
            }}
        class="btn variant-filled-primary"
        disabled="{$selectedDesks.length !== $selectedUsers.length}"
>Book
</button>
<!--    -->


