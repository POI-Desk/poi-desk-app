<script lang="ts">
	import { interval, addOutlook } from '$lib/bookingStore';
	export let seat: any = undefined; //get table from parent page
	export let date: Date = new Date(2022, 12, 2); // get date from parent page
</script>

<ul class="steps mb-5">
	<li class="step step-primary">Register Workspace</li>
	<li class="step">Confirm Selection</li>
</ul>
<h3 class="font-bold text-lg">Book Table {seat.seatnum}</h3>
<p class="py-4">Table: {seat.seatnum}</p>
<p class="py-3">Date: {date.toLocaleDateString()}</p>
<div class="form-control">
	<label class="label cursor-pointer">
		<span class="label-text">7:00 - 13:00</span>
		<hr class="w-1/4 border-gray-500" />
		<input value="morning" type="checkbox" class="checkbox" bind:checked={$interval.morning} />
	</label>
	<label class="label cursor-pointer">
		<span class="label-text">13:00 - 20:00</span>
		<hr class="w-1/4 border-gray-500" />
		<input value="afternoon" type="checkbox" class="checkbox" bind:checked={$interval.afternoon} />
	</label>
</div>
<div class="form-control">
	<label class="label cursor-pointer">
		<span class="label-text">Add to Outlook</span>
		<hr class="w-1/4 border-gray-500" />
		<input type="checkbox" class="checkbox" bind:checked={$addOutlook} />
	</label>
</div>

<style>
</style>
