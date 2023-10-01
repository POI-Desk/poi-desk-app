<script lang="ts">
	import { addOutlook, interval } from '$lib/bookingStore';

	//export let parent: any;

	import { getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	export let desk: any = undefined; //get desk from parent page
	export let date: Date = new Date(2022, 12, 2); // get date from parent page
</script>

{#if $modalStore[0]}
	<ul class="steps mb-5">
		<li class="step step-primary">Register Workspace</li>
		<li class="step step-primary">Confirm Selection</li>
	</ul>
	<h3 class="font-bold text-lg">Book Desk {desk.seatnum}</h3>
	<p class="py-4">Desk: {desk.desknum}</p>
	<p class="py-4">Date: {date.toLocaleDateString()}</p>
	<p class="py-4">Time: {JSON.stringify($interval)}</p>
	{#if $addOutlook}
		<p class="py-4">Added to Outlook</p>
	{/if}

	<style>
	</style>
{/if}
