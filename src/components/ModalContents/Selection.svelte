<script lang="ts">
    import {interval, addOutlook} from '$lib/bookingStore';

    export let desk: any = undefined; //get desk from parent page
    export let date: Date = new Date(2022, 12, 2); // get date from parent page

    export let hasBookings: boolean;
    export let isBookedMorning: boolean;
    export let isBookedAfternoon: boolean;
    export let isFullDay: boolean;

    let fullDayOnePerson: boolean = isFullDay && desk.bookings.length === 1; // vielleicht für visualization später

    $interval.morning = false;
    $interval.afternoon = false;

    function morningBookedName() {
        return desk.bookings[0].ismorning ? desk.bookings[0].user.username
            : desk.bookings[1].user.username;
    }

    function afternoonBookedName() {
        return desk.bookings[0].isafternoon ? desk.bookings[0].user.username
            : desk.bookings[1].user.username;
    }

    function handleCheckboxChange(dayTime: string) {
        if (dayTime === "morning") {
            $interval.morning = !isBookedMorning ? !$interval.morning : false;
        } else if (dayTime === "afternoon") {
            $interval.afternoon = !isBookedAfternoon ? !$interval.afternoon : false;
        }

        return undefined;
    }
</script>

{#if !isFullDay}
    <ul class="steps mb-5">
        <li class="step step-primary">Register Workspace</li>
        <li class="step">Confirm Selection</li>
    </ul>
{/if}

<div>
    <h3 class="font-bold text-lg">Desk {desk.desknum}</h3>
    <p class="py-3">Date: {date.toLocaleDateString()}</p>
    {#if (desk.attributes.length > 0)}
        <p>Attributes:
            {#each desk.attributes as attribute, i}
                {#if (i === desk.attributes.length - 1)}
                    {attribute.attributename}
                {:else}
                    {attribute.attributename},&nbsp;
                {/if}
            {/each}
        </p>
    {/if}
</div>

<div class="form-control">
    <label class="label cursor-pointer">
        <span class="label-text">07:00 - 13:00</span>
        {#if isBookedMorning}
            {morningBookedName()}
        {:else}
            <hr class="w-1/4 border-gray-500"/>
        {/if}
        <input
                value="morning" type="checkbox" class="checkbox"
                disabled={isBookedMorning}
                on:change={() => {handleCheckboxChange("morning")}}
        />
    </label>

    <label class="label cursor-pointer">
        <span class="label-text">13:00 - 20:00</span>
        {#if isBookedAfternoon}
            {afternoonBookedName()}
        {:else}
            <hr class="w-1/4 border-gray-500"/>
        {/if}
        <input
                value="morning" type="checkbox" class="checkbox"
                disabled={isBookedAfternoon}
                on:change={() => {handleCheckboxChange("afternoon")}}
        />
    </label>
</div>


{#if !isFullDay}
    <div class="form-control">
        <label class="label cursor-pointer">
            <span class="label-text">Add to Outlook</span>
            <hr class="w-1/4 border-gray-500"/>
            <input type="checkbox" class="checkbox" bind:checked={$addOutlook}/>
        </label>
    </div>
{/if}