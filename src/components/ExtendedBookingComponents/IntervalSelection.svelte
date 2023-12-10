<script>
    import {interval} from "$lib/bookingStore.ts";

    let selectedInterval = "morning";

    $: if (selectedInterval) {
        $interval.morning = (selectedInterval === "morning") || (selectedInterval === "full day");
        $interval.afternoon = (selectedInterval === "afternoon") || (selectedInterval === "full day");
    }
</script>

<div class="group w-fit">
    <div class="dropdown">
        <select class="select" bind:value={selectedInterval}>
<!--            <option value="" disabled selected>Select an interval</option>-->
            <option value="morning" selected>morning</option>
            <option value="afternoon">afternoon</option>
            <option value="full day">full day</option>
        </select>
    </div>
</div>
