<script lang="ts">
	import { interval, selectedDesk, displayedTime } from '$lib/bookingStore';
	import { dateValue } from '$lib/dateStore';
	import { fade } from 'svelte/transition';
	import { user } from '$lib/userStore';

	let morningSelected: boolean = false;
	let afternoonSelected: boolean = false;
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

	const baseStyle = 'h-1/2 w-full flex gap-4';
	let staticLocation = 'POI/AT';
	let location = `${$user.location?.locationname}`;
</script>

<div class="h-full flex flex-col gap-4">
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:click={() => {
			if (!isBookedMorning) {
				morningSelected = !morningSelected;
			}
		}}
		class={baseStyle}
	>
		<div class="w-9/12 h-full p-2 bg-green-200 rounded-3xl">
			{#if morningSelected && !isBookedMorning}
				<div in:fade class="flex flex-col gap-2 w-full h-full">
					<div class="flex w-full h-1/2 gap-2">
						<div class="w-1/2 h-full bg-white rounded-3xl flex items-center justify-center">
							<p>{staticLocation} <br /> {location}</p>
						</div>
						<div class="w-1/2 h-full bg-white rounded-3xl" />
					</div>
					<div class="h-1/2 bg-green-500 rounded-3xl flex justify-center items-center">
						<p>{$user.username}</p>
					</div>
				</div>
			{:else if !isBookedMorning}
				<div in:fade class="flex flex-col gap-2 w-full h-full">
					<div class="flex justify-center items-center w-full h-full">FREE</div>
				</div>
			{:else if isBookedMorning}
				<div in:fade class="flex flex-col gap-2 w-full h-full">
					<div class="flex w-full h-1/2 gap-2">
						<div class="w-1/2 h-full bg-white rounded-3xl flex items-center justify-center">
							<p>{staticLocation} <br /> {location}</p>
						</div>
						<div class="w-1/2 h-full bg-white rounded-3xl" />
					</div>
					<div class="h-1/2 bg-red-500 rounded-3xl flex justify-center items-center">
						<p>{morningAlreadyTakenName}</p>
					</div>
				</div>
			{/if}
		</div>
		<div class="btn w-3/12 h-full bg-yellow-200 rounded-full">
			07:00 <br /> 13:00 <br />
		</div>
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:click={() => {
			if (!isBookedAfternoon) {
				afternoonSelected = !afternoonSelected;
			}
		}}
		class={baseStyle}
	>
		<div class="w-9/12 h-full p-2 bg-green-200 rounded-3xl">
			{#if afternoonSelected && !isBookedAfternoon}
				<div in:fade class="flex flex-col gap-2 w-full h-full">
					<div class="flex w-full h-1/2 gap-2">
						<div class="w-1/2 h-full bg-white rounded-3xl flex items-center justify-center">
							<p>{staticLocation} <br /> {location}</p>
						</div>
						<div class="w-1/2 h-full bg-white rounded-3xl" />
					</div>
					<div class="h-1/2 bg-green-500 rounded-3xl flex justify-center items-center">
						<p>{$user.username}</p>
					</div>
				</div>
			{:else if !isBookedAfternoon}
				<div in:fade class="flex flex-col gap-2 w-full h-full">
					<div class="flex justify-center items-center w-full h-full">FREE</div>
				</div>
			{:else if isBookedAfternoon}
				<div in:fade class="flex flex-col gap-2 w-full h-full">
					<div class="flex w-full h-1/2 gap-2">
						<div class="w-1/2 h-full bg-white rounded-3xl flex items-center justify-center">
							<p>{staticLocation} <br /> {location}</p>
						</div>
						<div class="w-1/2 h-full bg-white rounded-3xl" />
					</div>
					<div class="h-1/2 bg-red-500 rounded-3xl flex justify-center items-center">
						<p>{afternoonAlreadyTakenName}</p>
					</div>
				</div>
			{/if}
		</div>
		<div class="btn w-3/12 h-full bg-yellow-200 rounded-full">
			13:00 <br /> 20:00 <br />
		</div>
	</div>
</div>
