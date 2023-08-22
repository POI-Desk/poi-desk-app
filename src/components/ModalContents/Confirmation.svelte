<script lang="ts">
	export let addOutlook: boolean = false; //addOutlook is binded to the checkbox
	export let table: string = 'defaultValue'; //get table from parent page
	export let date: Date = new Date(2022, 12, 2); // get date from parent page
	export let time: string = 'none';
</script>

<ul class="steps mb-5">
	<li class="step step-primary">Register Workspace</li>
	<li class="step step-primary">Confirm Selection</li>
</ul>
<h3 class="font-bold text-lg">Book Table {table}</h3>
<p class="py-4">Table: {table}</p>
<p class="py-4">Date: {date.toLocaleDateString()}</p>
<p class="py-4">Time: {time}</p>
{#if addOutlook}
	<p class="py-4">Added to Outlook</p>
{/if}


<style>
</style>
