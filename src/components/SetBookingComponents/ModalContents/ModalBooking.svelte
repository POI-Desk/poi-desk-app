<script lang="ts">
	import { displayedTime, interval } from '$lib/bookingStore';
	import { dateValue, maxBookingDate, todaysDate } from '$lib/dateStore';
	import { bookDesk } from '$lib/mutations/booking';
	import { user } from '$lib/userStore';
	import BookingDeskState from '$components/SetBookingComponents/BookingDeskState.svelte';
	import { Button } from '$lib/components/ui/button';
	import {
		Clock,
		MapPin,
		Building,
		Armchair,
		Cuboid,
		ArrowBigLeft,
		ArrowBigRight,
		ArrowLeft,
		Calendar
	} from 'lucide-svelte';
	import { getBookingsByDate } from '$lib/queries/booking';
	import { CachePolicy } from '$houdini';
	import { floorid } from '$lib/floorStore';
	import { getDeskById } from '$lib/queries/deskQueries';
	import { onMount } from 'svelte';
	import { invalidateAll } from '$app/navigation';

	$interval.morning = false;
	$interval.afternoon = false;

	$: selectedDesk = $getDeskById.data?.getDeskById;

	async function finishBooking() {
		const value = await bookDesk.mutate({
			booking: {
				date: $dateValue,
				ismorning: $interval.morning,
				isafternoon: $interval.afternoon,
				userid: $user.pk_userid,
				deskid: selectedDesk!.pk_deskid,
				extendedid: ''
			}
		});

		await getBookingsByDate.fetch({
			variables: { date: $dateValue, floorId: $floorid },
			policy: CachePolicy.NetworkOnly
		});
		invalidateAll();
	}

	function onExitHandler() {
		$dateValue = new Date().toISOString().split('T')[0];
	}

	let date: Date = new Date($dateValue);

	let selectionPage: boolean = true;

	let currentBookingsOnDate;

	let hasBookings: boolean;

	let isBookedMorning: boolean;

	let isBookedAfternoon: boolean;

	let isFullDay: boolean;

	onMount(() => {
		currentBookingsOnDate = selectedDesk?.bookings?.filter((b: any) => b.date === $dateValue) ?? [];
		hasBookings = currentBookingsOnDate.length > 0;
		isBookedMorning =
			((hasBookings && currentBookingsOnDate[0].ismorning) ||
				currentBookingsOnDate[1]?.ismorning) ??
			false;
		isBookedAfternoon =
			((hasBookings && currentBookingsOnDate[0].isafternoon) ||
				currentBookingsOnDate[1]?.isafternoon) ??
			false;
		isFullDay = hasBookings && isBookedMorning && isBookedAfternoon;
	});

	//const cBase = 'card p-4 shadow-xl space-y-4';

	function whenSelection() {
		const selectedDate = new Date($dateValue);
		const isInBookingRange =
			selectedDate.getTime() >= todaysDate.setHours(0, 0, 0, 0) &&
			selectedDate.getTime() <= maxBookingDate.getTime();
		if (!isFullDay && isInBookingRange) {
			if (!$interval.morning && !$interval.afternoon) {
				return;
			}
			selectionPage = !selectionPage;
			return;
		}
	}

	function addDay() {
		let date = new Date($dateValue);
		date.setDate(date.getDate() + 1);
		$dateValue = date.toISOString().split('T')[0]; // format back to 'yyyy-mm-dd'
	}

	function subtractDay() {
		if ($dateValue === new Date().toISOString().split('T')[0]) {
			return;
		}
		let date = new Date($dateValue);
		date.setDate(date.getDate() - 1);
		$dateValue = date.toISOString().split('T')[0]; // format back to 'yyyy-mm-dd'
	}
	const iconContainerClasses = 'rounded-xl flex justify-center variant-filled-tertiary';
	const textClasses = 'col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white text-black';
</script>

<div class="h-full">
	<div class="rounded-xl w-full h-full flex flex-col">
		{#if selectionPage}
			<div class=" flex justify-center items-center">
				<div class="flex items-center gap-x-5 bg-white text-primary-500 rounded-full p-4 px-10">
					<h1 class="text-black">{selectedDesk?.desknum}</h1>
				</div>
			</div>
			<div class="basis-full text-primary-500 font-bold">
				<BookingDeskState />
			</div>
			<div class="p-3">
				<div class="bg-white text-primary-500 h-16 flex items-center justify-between px-10">
					<Button on:click={subtractDay} class="bg-white text-black">
						<ArrowBigLeft />
					</Button>
					<h1 class="text-black">{$dateValue}</h1>
					<Button on:click={addDay} class="bg-white text-black">
						<ArrowBigRight />
					</Button>
				</div>
			</div>
			<div class="h-24 flex items-center justify-center p-3 max-h-[75px]">
				<Button on:click={() => whenSelection()} class="btn w-full h-full text-xl ">Book</Button>
			</div>
		{:else}
			<div class="text-center align-middle px-4 pt-5">
				<!-- <Button
					on:click={() => {
						selectionPage = !selectionPage;
						$interval.morning = false;
						$interval.afternoon = false;
					}}
				>
					<ArrowLeft />
				</Button> -->
				<h1 class="text-center text-3xl p-3">Booking</h1>
			</div>
			<div class="h-full flex items-center justify-center text-primary-500">
				<div class="grid grid-cols-3 grid-rows-6 gap-7">
					<div class={iconContainerClasses}>
						<div class="rounded-3xl m-3 mx-5">
							<Calendar />
						</div>
					</div>
					<div class={textClasses}>
						{$dateValue}
					</div>
					<div class={iconContainerClasses}>
						<div class="rounded-3xl m-3 mx-5">
							<Clock />
						</div>
					</div>
					<div class={textClasses}>
						{$displayedTime}
					</div>
					<div class={iconContainerClasses}>
						<div class="rounded-3xl m-3 mx-5">
							<MapPin />
						</div>
					</div>
					<div class={textClasses}>
						{$user.location?.locationname}
					</div>
					<div class={iconContainerClasses}>
						<div class="rounded-3xl m-3 mx-5">
							<Building />
						</div>
					</div>
					<div class={textClasses}>
						{selectedDesk?.map?.floor.building.buildingname}
					</div>
					<div class={iconContainerClasses}>
						<div class="rounded-3xl m-3 mx-5">
							<Cuboid />
						</div>
					</div>
					<div class={textClasses}>
						{selectedDesk?.map?.floor.floorname}
					</div>
					<div class={iconContainerClasses}>
						<div class="rounded-3xl m-3 mx-5">
							<Armchair />
						</div>
					</div>
					<div class={textClasses}>
						{selectedDesk?.desknum}
					</div>
				</div>
			</div>
			<div class="h-24 rounded-full">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div on:click={() => finishBooking()} class="w-full h-full text-xl p-3 max-h-[75px]">
					<slot />
				</div>
			</div>
		{/if}
	</div>
</div>
