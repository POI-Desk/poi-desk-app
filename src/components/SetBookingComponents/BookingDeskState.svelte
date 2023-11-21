<script lang="ts">
	import { interval, selectedDesk, displayedTime } from '$lib/bookingStore';
	import { dateValue } from '$lib/dateStore';
	import { fade } from 'svelte/transition';
	import { user } from '$lib/userStore';

	let morningSelected: boolean = false;
	let afternoonSelected: boolean = false;
	export let shownInterval: String = 'default';
	// just for now
	let currentBookingsOnDate = $selectedDesk.bookings.filter((b: any) => b.date === $dateValue);
	let isBookedMorning: boolean = currentBookingsOnDate.some((booking: any) => booking.ismorning);
	let isBookedAfternoon: boolean = currentBookingsOnDate.some(
		(booking: any) => booking.isafternoon
	);

	let morningAlreadyTakenName: string = '';
	let afternoonAlreadyTakenName: string = '';
	for (const booking of currentBookingsOnDate) {
		if (booking.date === $dateValue) {
			if (booking.ismorning) {
				morningAlreadyTakenName = booking.user.username;
			}
			if (booking.isafternoon) {
				afternoonAlreadyTakenName = booking.user.username;
			}
		}
	}

	$: $interval.morning = morningSelected;
	$: $interval.afternoon = afternoonSelected;

	$: {
		if ($dateValue) {
			morningSelected = false;
			afternoonSelected = false;
			currentBookingsOnDate = $selectedDesk.bookings.filter((b: any) => b.date === $dateValue);
			isBookedMorning = currentBookingsOnDate.some((booking: any) => booking.ismorning);
			isBookedAfternoon = currentBookingsOnDate.some((booking: any) => booking.isafternoon);
			for (const booking of currentBookingsOnDate) {
				if (booking.date === $dateValue) {
					if (booking.ismorning) {
						morningAlreadyTakenName = booking.user.username;
					}
					if (booking.isafternoon) {
						afternoonAlreadyTakenName = booking.user.username;
					}
				}
			}
		}
	}
	$: {
		if ($interval.morning && $interval.afternoon) {
			$displayedTime = '07:00 - 20:00';
		} else if ($interval.morning) {
			$displayedTime = '07:00 - 13:00';
		} else if ($interval.afternoon) {
			$displayedTime = '13:00 - 20:00';
		}
	}

	// TODO: change name to logged in user.
	// TODO: change name when already taken to user who booked it.
</script>

<div class="col-span-5 row-span-5">
	<!--amongus-->
	{#if shownInterval == 'morning'}
		{#if morningSelected && !isBookedMorning}
			<div
				in:fade
				class="rounded-3xl grid grid-cols-2 row-span-2 gap-[0.4rem] p-[0.4rem] variant-filled-secondary w-full h-full"
			>
				<div class="rounded-3xl bg-white text-black flex items-center justify-center">
					POI/AT <br /> Vienna
				</div>
				<div class="rounded-3xl bg-white text-black" />
				<div class="col-span-2 rounded-3xl bg-white text-black flex items-center justify-center">
					{$user.username}
				</div>
			</div>
		{:else if !isBookedMorning}
			<div
				in:fade
				class=" rounded-3xl grid grid-cols-2 row-span-2 variant-filled-tertiary w-full h-full"
			>
				<div class="col-span-2 flex items-center justify-center text-xl">Free</div>
			</div>
		{:else if isBookedMorning}
			<div
				in:fade
				class="rounded-3xl grid grid-cols-2 row-span-2 gap-[0.4rem] p-[0.4rem] variant-filled-secondary w-full h-full"
			>
				<div class="rounded-3xl bg-white text-black flex items-center justify-center">
					POI/AT <br /> Vienna
				</div>
				<div class="rounded-3xl bg-white text-black" />
				<div class="col-span-2 rounded-3xl bg-white text-black flex items-center justify-center">
					{morningAlreadyTakenName}
				</div>
			</div>
		{/if}
	{:else if shownInterval == 'afternoon'}
		{#if afternoonSelected && !isBookedAfternoon}
			<div
				in:fade
				class="rounded-3xl grid grid-cols-2 row-span-2 gap-[0.4rem] p-[0.4rem] variant-filled-secondary w-full h-full"
			>
				<div class="rounded-3xl bg-white text-black flex items-center justify-center">
					POI/AT <br /> Vienna
				</div>
				<div class="rounded-3xl bg-white text-black" />
				<div class="col-span-2 rounded-3xl bg-white text-black flex items-center justify-center">
					{$user.username}
				</div>
			</div>
		{:else if !isBookedAfternoon}
			<div
				in:fade
				class="rounded-3xl grid grid-cols-2 row-span-2 variant-filled-tertiary w-full h-full"
			>
				<div class="col-span-2 flex items-center justify-center text-xl">Free</div>
			</div>
		{:else if isBookedAfternoon}
			<div
				in:fade
				class="rounded-3xl grid grid-cols-2 row-span-2 variant-filled-secondary w-full h-full"
			>
				<div class="rounded-3xl bg-white text-black m-1 flex items-center justify-center">
					POI/AT <br /> Vienna
				</div>
				<div class="rounded-3xl bg-white text-black m-1" />
				<div
					class="col-span-2 rounded-3xl bg-white text-black m-1 flex items-center justify-center"
				>
					{afternoonAlreadyTakenName}
				</div>
			</div>
		{/if}
	{/if}
</div>
<div class="col-span-2 row-span-5">
	{#if shownInterval == 'morning'}
		<button
			class="btn rounded-full variant-filled-primary w-full h-full"
			disabled={isBookedMorning}
			on:click={() => (morningSelected = !morningSelected)}
			>07:00 <br /> 13:00 <br />
		</button>
	{:else if shownInterval == 'afternoon'}
		<button
			class="btn rounded-full variant-filled-primary w-full h-full"
			disabled={isBookedAfternoon}
			on:click={() => (afternoonSelected = !afternoonSelected)}
			>13:00 <br /> 20:00 <br />
		</button>
	{/if}
</div>
