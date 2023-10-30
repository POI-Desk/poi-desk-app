<script lang="ts">
	import { interval, selectedDesk } from '$lib/bookingStore';
	import { fade } from 'svelte/transition';

	let morningSelected: boolean = false;
	let afternoonSelected: boolean = false;
	export let shownInterval: String = 'default';
	// just for now
	let morningAlreadyTaken: boolean = false;
	let afternoonAlreadyTaken: boolean = false;

	// not clean code :( makes me sad 😭 😭 
	// TODO: rewrite this
	// code does like "work" but also not soooooo
		if ($selectedDesk.bookings.length > 0) {
		morningAlreadyTaken = $selectedDesk.bookings[0].ismorning;
		afternoonAlreadyTaken = $selectedDesk.bookings[0].isafternoon;
	}

	$: $interval.morning = morningSelected;
	$: $interval.afternoon = afternoonSelected;

	// TODO: change name to logged in user.
	// TODO: change name when already taken to user who booked it. 
</script>

<div class="col-span-5 row-span-5">
	<!--amongus-->
	{#if shownInterval == 'morning'}
		{#if morningSelected && !morningAlreadyTaken}
			<div in:fade class="rounded-3xl grid grid-cols-2 bg-slate-500 w-full h-full">
				<div class="rounded-3xl bg-white text-black m-1 flex items-center justify-center">
					POI/AT <br /> Vienna
				</div>
				<div class="rounded-3xl bg-white text-black m-1">insert image here</div>
				<div
					class="col-span-2 rounded-3xl bg-white text-black m-1 flex items-center justify-center"
				>
					Maximilian <br />Schwarzmüller
				</div>
			</div>
		{:else if !morningAlreadyTaken}
			<div in:fade class="rounded-3xl grid grid-cols-2 variant-filled-primary w-full h-full">
				<div class="col-span-2 flex items-center justify-center text-xl">Free</div>
			</div>
		{:else if morningAlreadyTaken}
			<div in:fade class="rounded-3xl grid grid-cols-2 bg-orange-500 w-full h-full">
				<div class="rounded-3xl bg-white text-black m-1 flex items-center justify-center">
					POI/AT <br /> Vienna
				</div>
				<div class="rounded-3xl bg-white text-black m-1">insert image here</div>
				<div
					class="col-span-2 rounded-3xl bg-white text-black m-1 flex items-center justify-center"
				>
					Maximilian <br />Schwarzmüller
				</div>
			</div>
		{/if}
	{:else if shownInterval == 'afternoon'}
		{#if afternoonSelected && !afternoonAlreadyTaken}
			<div in:fade class="rounded-3xl grid grid-cols-2 bg-slate-500 w-full h-full">
				<div class="rounded-3xl bg-white text-black m-1 flex items-center justify-center">
					POI/AT <br /> Vienna
				</div>
				<div class="rounded-3xl bg-white text-black m-1">insert image here</div>
				<div
					class="col-span-2 rounded-3xl bg-white text-black m-1 flex items-center justify-center"
				>
					Maximilian <br />Schwarzmüller
				</div>
			</div>
		{:else if !afternoonAlreadyTaken}
			<div in:fade class="rounded-3xl grid grid-cols-2 variant-filled-primary w-full h-full">
				<div class="col-span-2 flex items-center justify-center text-xl">Free</div>
			</div>
		{:else if afternoonAlreadyTaken}
			<div in:fade class="rounded-3xl grid grid-cols-2 bg-orange-500 w-full h-full">
				<div class="rounded-3xl bg-white text-black m-1 flex items-center justify-center">
					POI/AT <br /> Vienna
				</div>
				<div class="rounded-3xl bg-white text-black m-1">insert image here</div>
				<div
					class="col-span-2 rounded-3xl bg-white text-black m-1 flex items-center justify-center"
				>
					Maximilian <br />Schwarzmüller
				</div>
			</div>
		{/if}
	{/if}
</div>
<div class="col-span-2 row-span-5">
	{#if shownInterval == 'morning'}
		<button
			class="btn rounded-full variant-filled-primary w-full h-full"
			disabled={morningAlreadyTaken}
			on:click={() => morningSelected = !morningSelected}
			>07:00 <br /> 13:00 <br /> {morningAlreadyTaken}
		</button>
	{:else if shownInterval == 'afternoon'}
		<button
			class="btn rounded-full variant-filled-primary w-full h-full"
			disabled={afternoonAlreadyTaken}
			on:click={() => afternoonSelected = !afternoonSelected}
			>13:00 <br /> 20:00 <br /> {afternoonAlreadyTaken}
		</button>
	{/if}
</div>

<style>
	
</style>
