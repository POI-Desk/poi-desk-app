<script lang="ts">
	import { displayedTime, interval } from '$lib/bookingStore';
	import { dateValue } from '$lib/dateStore';
	import { getDeskById } from '$lib/queries/deskQueries';
	import { user } from '$lib/userStore';
	import { onMount } from 'svelte';
	import { fade } from 'svelte/transition';

	let morningSelected: boolean = false;
	let afternoonSelected: boolean = false;
	// export let shownInterval: String = 'default';
	// just for now

	$: selectedDesk = $getDeskById.data?.getDeskById;

	let currentBookingsOnDate;
	let isBookedMorning: boolean;
	let isBookedAfternoon: boolean
	let deskAssigned: boolean;
	let morningAlreadyTakenName: string = '';
	let afternoonAlreadyTakenName: string = '';

	onMount(() => {
		currentBookingsOnDate = selectedDesk?.bookings?.filter((b: any) => b.date === $dateValue)!;
		isBookedMorning = currentBookingsOnDate?.some((booking: any) => booking.ismorning)!;
		isBookedAfternoon = currentBookingsOnDate?.some((booking: any) => booking.isafternoon);
		deskAssigned = selectedDesk?.user !== null;

		for (const booking of currentBookingsOnDate ?? []) {
			if (booking.date === $dateValue) {
				if (booking.ismorning) {
					morningAlreadyTakenName = booking.user.username;
				}
				if (booking.isafternoon) {
					afternoonAlreadyTakenName = booking.user.username;
				}
			}
		}

		if (deskAssigned) {
			morningAlreadyTakenName = selectedDesk?.user?.username ?? '';
			afternoonAlreadyTakenName = selectedDesk?.user?.username ?? '';
		}
	});

	$: $interval.morning = morningSelected;
	$: $interval.afternoon = afternoonSelected;

	$: {
		if ($dateValue) {
			morningSelected = false;
			afternoonSelected = false;
			currentBookingsOnDate = selectedDesk?.bookings!.filter((b: any) => b.date === $dateValue) ?? [];
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
			if (!isBookedMorning && !deskAssigned) {
				morningSelected = !morningSelected;
			}
		}}
		class={baseStyle}
	>
		<div
			class="w-9/12 h-full p-2 rounded-3xl"
			class:bg-white={!morningSelected && !isBookedMorning}
			class:border-4={!morningSelected && !isBookedMorning}
			class:border-primary-500={!morningSelected && !isBookedMorning}
			class:variant-filled-secondary={morningSelected || isBookedMorning}
		>
			{#if morningSelected && !isBookedMorning}
				<div in:fade class="flex flex-col gap-2 w-full h-full">
					<div class="flex w-full h-1/2 gap-2">
						<div class="w-1/2 h-full bg-white text-black rounded-3xl flex items-center justify-center">
							<p>{staticLocation} <br /> {location}</p>
						</div>
						<div class="w-1/2 h-full bg-white rounded-3xl" />
					</div>
					<div class="h-1/2 bg-white text-black rounded-3xl flex justify-center items-center">
						<p>{$user.username}</p>
					</div>
				</div>
			{:else if !isBookedMorning && !deskAssigned}
				<div in:fade class="flex flex-col gap-2 w-full h-full">
					<div class="flex justify-center items-center w-full h-full">FREE</div>
				</div>
			{:else}
				<div in:fade class="flex flex-col gap-2 w-full h-full">
					<div class="flex w-full h-1/2 gap-2">
						<div class="w-1/2 h-full bg-white text-black rounded-3xl flex items-center justify-center">
							<p>{staticLocation} <br /> {location}</p>
						</div>
						<div class="w-1/2 h-full bg-white rounded-3xl" />
					</div>
					<div class="h-1/2 bg-white text-black rounded-3xl flex justify-center items-center">
						<p>{morningAlreadyTakenName}</p>
					</div>
				</div>
			{/if}
		</div>
		<div
			class="btn w-3/12 h-full variant-filled-primary rounded-full"
			class:variant-filled-primary={!isBookedMorning}
			class:variant-filled-secondary={isBookedMorning}
		>
			07:00 <br /> 13:00 <br />
		</div>
	</div>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		on:click={() => {
			if (!isBookedAfternoon && !deskAssigned) {
				afternoonSelected = !afternoonSelected;
			}
		}}
		class={baseStyle}
	>
		<div
			class="w-9/12 h-full p-2 rounded-3xl"
			class:bg-white={!afternoonSelected && !isBookedAfternoon}
			class:border-4={!afternoonSelected && !isBookedAfternoon}
			class:border-primary-500={!afternoonSelected && !isBookedAfternoon}
			class:variant-filled-secondary={afternoonSelected || isBookedAfternoon}
		>
			{#if afternoonSelected && !isBookedAfternoon}
				<div in:fade class="flex flex-col gap-2 w-full h-full">
					<div class="flex w-full h-1/2 gap-2">
						<div class="w-1/2 h-full bg-white text-black rounded-3xl flex items-center justify-center">
							<p>{staticLocation} <br /> {location}</p>
						</div>
						<div class="w-1/2 h-full bg-white rounded-3xl" />
					</div>
					<div class="h-1/2 bg-white text-black rounded-3xl flex justify-center items-center">
						<p>{$user.username}</p>
					</div>
				</div>
			{:else if !isBookedAfternoon && !deskAssigned}
				<div in:fade class="flex flex-col gap-2 w-full h-full">
					<div class="flex justify-center items-center w-full h-full">FREE</div>
				</div>
			{:else}
				<div in:fade class="flex flex-col gap-2 w-full h-full">
					<div class="flex w-full h-1/2 gap-2">
						<div class="w-1/2 h-full bg-white text-black rounded-3xl flex items-center justify-center">
							<p>{staticLocation} <br /> {location}</p>
						</div>
						<div class="w-1/2 h-full bg-white rounded-3xl" />
					</div>
					<div class="h-1/2 bg-white text-black rounded-3xl flex justify-center items-center">
						<p>{afternoonAlreadyTakenName}</p>
					</div>
				</div>
			{/if}
		</div>
		<div
			class="btn w-3/12 h-full variant-filled-primary rounded-full"
			class:variant-filled-primary={!isBookedAfternoon}
			class:variant-filled-secondary={isBookedAfternoon}
		>
			13:00 <br /> 20:00 <br />
		</div>
	</div>
</div>
