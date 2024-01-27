<script>
    import {interval} from "$lib/bookingStore.ts";
    import {selectedDesks} from "$lib/stores/extendedUserStore.ts";

    let selectedInterval = "morning";

    $: {
        $interval.morning = (selectedInterval === "morning") || (selectedInterval === "full day");
        $interval.afternoon = (selectedInterval === "afternoon") || (selectedInterval === "full day");
        $selectedDesks = [];
    }
</script>

<div class="group w-fit">
    <div class="dropdown">
        <select class="select rounded-full" bind:value={selectedInterval}>
            <option value="morning" selected>morning</option>
            <option value="afternoon">afternoon</option>
            <option value="full day">full day</option>
        </select>
    </div>
</div>
