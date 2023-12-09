<script>
    import {interval} from "$lib/bookingStore.ts";

    let selectedInterval = "";

    $: if (selectedInterval) {
        $interval.morning = (selectedInterval === "morning") || (selectedInterval === "full day");
        $interval.afternoon = (selectedInterval === "afternoon") || (selectedInterval === "full day");
    }
</script>

<div class="group w-fit">
    <div class="dropdown">
        <select class="select" bind:value={selectedInterval}>
            <option value="" disabled selected>Select an interval</option>
            <option value="morning">morning</option>
            <option value="afternoon">afternoon</option>
            <option value="full day">full day</option>
        </select>
    </div>
</div>

<p>Interval: {selectedInterval}</p>
<p>Morning : {$interval.morning}</p>
<p>Afternoon : {$interval.afternoon}</p>
