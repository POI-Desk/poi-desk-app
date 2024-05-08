<script lang="ts">
	import { CachePolicy, graphql } from '$houdini';
	import { currentBooking, displayedTime, getBookings } from '$lib/bookingStore';
	import { Button } from '$lib/components/ui/button';
	import { delBooking, editBooking } from '$lib/mutations/booking';
	import { getBookingsByDateBetween } from '$lib/queries/booking';
	import type { Booking } from '$lib/types/bookingTypes';
	import { user } from '$lib/userStore';
	import {
		ListBox,
		ListBoxItem,
		RadioGroup,
		RadioItem,
		getModalStore,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import {
		Armchair,
		ArrowLeft,
		Building,
		Calendar,
		Check,
		Clock,
		Cuboid,
		MapPin,
		Moon,
		Sun,
		X
	} from 'lucide-svelte';
	import { toast } from 'svelte-sonner';

	$: {
		if ($currentBooking.ismorning && $currentBooking.isafternoon) {
			$displayedTime = '07:00 - 20:00';
		} else if ($currentBooking.ismorning) {
			$displayedTime = '07:00 - 13:00';
		} else if ($currentBooking.isafternoon) {
			$displayedTime = '13:00 - 20:00';
		}
		firstDate = $currentBooking.date;
		firstTime = $displayedTime;
	}

	const modalStore = getModalStore();

	let desk = $currentBooking.desk;
	let deleteBookingState: boolean = false;
	let editBookingState: boolean = false;
	let editDate: string = $currentBooking.date;
	let startDate: Date = new Date();
	let endDate: Date = new Date(new Date().getTime() + 12096e5);
	let value: string = '';
	let firstDate: string;
	let firstTime: string;

	$: value = $displayedTime;

	let tempMorning: boolean = $currentBooking.ismorning;
	let tempAfternoon: boolean = $currentBooking.isafternoon;
	let tempDesk: string = desk.pk_deskid;

	const popupDates: PopupSettings = {
		event: 'focus-click',
		target: 'popupDates',
		placement: 'bottom',
		closeQuery: '.fortniteDates'
	};

	const getBookingsByNumContains = graphql(`
		query GetBookingsByBookingnumberContains($string: String!) @load {
			getBookingsByBookingnumberContains(string: $string) {
				pk_bookingid
				bookingnumber
			}
		}
	`);

	export const _GetBookingsByBookingnumberContainsVariables = () => {
		return {};
	};

	$: extendedBookings = $getBookingsByNumContains.data?.getBookingsByBookingnumberContains;

	const deleteBooking = async (booking: Booking) => {
		const id = booking.pk_bookingid;

		if (booking.bookingnumber.includes('EXTID')) {
			const extId = booking.bookingnumber.split('EXTID')[1];

			if (extId.split('+')[1] !== $user.pk_userid) modalStore.close();

			await getBookingsByNumContains.fetch({ variables: { string: extId } });
			for (const b of extendedBookings ?? []) {
				await delBooking.mutate({ id: b.pk_bookingid });
			}
		} else {
			await delBooking.mutate({ id });
		}

		await getBookings.fetch({ policy: CachePolicy.NetworkOnly }); //TODO: DONT FETCH THIS! DELETE FROM ARRAY

		modalStore.close();
	};

	// get all dates between startDate and endDate and write them in an array
	function getDates(startDate: Date, endDate: Date) {
		const dateArray = [];
		let currentDate = new Date(startDate);

		while (currentDate <= endDate) {
			dateArray.push(new Date(currentDate));
			currentDate.setDate(currentDate.getDate() + 1);
		}

		return dateArray;
	}

	let dates = getDates(startDate, endDate);
	// rewrite all values in the array to the format yyyy-mm-dd and save them in a new array (toISOString)
	let stringDates: string[] = [];
	for (let i = 0; i < dates.length; i++) {
		stringDates.push(dates[i].toISOString().split('T')[0]);
	}

	$: getBookingsByDateBetween.fetch({
		variables: {
			startDate: stringDates[0],
			endDate: stringDates[stringDates.length - 1]
		}
	});
	$: bookings = $getBookingsByDateBetween.data?.getBookingsByDateBetween;
	$: if (bookings) {
		for (let i = 0; i < bookings.length; i++) {
			for (let j = 0; j < stringDates.length; j++) {
				if (bookings[i].date == stringDates[j]) {
					if (bookings[i].ismorning && bookings[i].isafternoon) {
						console.log(bookings[i].date, stringDates[j], 'deleted');
						stringDates.splice(j, 1);
					}
					if ($currentBooking.ismorning && !$currentBooking.isafternoon) {
						if (bookings[i].ismorning && !bookings[i].isafternoon) {
							console.log(bookings[i].date, stringDates[j], 'deleted');
							stringDates.splice(j, 1);
						}
					}
					if ($currentBooking.isafternoon && !$currentBooking.ismorning) {
						if (!bookings[i].ismorning && bookings[i].isafternoon) {
							console.log(bookings[i].date, stringDates[j], 'deleted');
							stringDates.splice(j, 1);
						}
					}
				}
			}
		}
	}

	const addFirstValues = (time: string) => {
		console.log('firstTime:', firstTime);
		console.log('time:', time);
		if (firstTime == time) {
			let displayFirstDate = firstDate + ' (current)';
			stringDates.push(displayFirstDate);
			return;
		}
	};

	function recalcDates(time: string) {
		editDate = 'click to select a date';
		stringDates = [];
		if (time == '07:00 - 13:00') {
			tempMorning = true;
			tempAfternoon = false;
		} else if (time == '13:00 - 20:00') {
			tempMorning = false;
			tempAfternoon = true;
		} else if (time == '07:00 - 20:00') {
			tempMorning = true;
			tempAfternoon = true;
		}
		for (let i = 0; i < dates.length; i++) {
			stringDates.push(dates[i].toISOString().split('T')[0]);
		}
		if (bookings) {
			for (let i = 0; i < bookings.length; i++) {
				for (let j = 0; j < stringDates.length; j++) {
					if (bookings[i].date == stringDates[j]) {
						if (bookings[i].ismorning && bookings[i].isafternoon) {
							console.log(bookings[i].date, stringDates[j], 'deleted');
							stringDates.splice(j, 1);
						}
						if (tempMorning && !tempAfternoon) {
							if (bookings[i].ismorning && !bookings[i].isafternoon) {
								console.log(bookings[i].date, stringDates[j], 'deleted');
								stringDates.splice(j, 1);
							}
						}
						if (tempAfternoon && !tempMorning) {
							if (!bookings[i].ismorning && bookings[i].isafternoon) {
								console.log(bookings[i].date, stringDates[j], 'deleted');
								stringDates.splice(j, 1);
							}
						}
					}
				}
			}
		}
		addFirstValues(time);
	}

	const finishEditBooking = async (
		bookingid: any,
		date: any,
		morning: boolean,
		afternoon: boolean,
		deskid: any
	) => {
		if (date == 'click to select a date') {
			toast.error('Please select a date before saving!', {
				position: 'bottom-center'
			});
			return;
		}
		await editBooking.mutate({
			bookingInput: {
				pk_bookingid: bookingid,
				date: date,
				ismorning: morning,
				isafternoon: afternoon,
				deskid: deskid
			}
		});
		await getBookings.fetch({ policy: CachePolicy.NetworkOnly });
		modalStore.close();
	};

	const iconContainerClasses = 'rounded-lg flex justify-center variant-filled-tertiary';
	const iconClasses = 'rounded-lg m-3 mx-5';
	const textClasses = 'col-span-2 rounded-lg flex justify-center items-center text-xl bg-white';
	const cBase = 'card p-4 shadow-xl space-y-4';
</script>

{#if $modalStore[0]}
	<div class="{cBase} rounded-xl lg:w-[470px] w-screen h-screen flex flex-col bg-slate-200 p-4">
		{#if deleteBookingState}
			<div class="h-full flex flex-col justify-center items-center text-center px-4 pt-5">
				<div class="grid grid-cols-3 align-middle">
					<h1 class="text-center text-3xl p-3">Booking</h1>
				</div>
				<div class="flex flex-col h-full justify-center gap-y-5 text-xl items-center align-middle">
					<p>Do you really want to delete this booking?</p>
					<div class="flex gap-5">
						<Button
							on:click={async () => {
								await deleteBooking($currentBooking);
							}}
							class="btn bg-green-400 rounded-lg"
						>
							<Check />
						</Button>
						<Button
							on:click={() => {
								deleteBookingState = !deleteBookingState;
							}}
							class="btn bg-red-400 rounded-lg"
						>
							<X />
						</Button>
					</div>
				</div>
			</div>
		{:else if !editBookingState}
			<div class="text-center align-middle px-4 pt-5">
				<h1 class="text-center text-3xl p-3">Booking</h1>
			</div>
			<div class="h-full flex items-center justify-center text-primary-500">
				<div class="grid grid-cols-3 grid-rows-6 gap-7">
					<div class={iconContainerClasses}>
						<div class={iconClasses}>
							<Calendar />
						</div>
					</div>
					<div class={textClasses}>
						{$currentBooking.date}
					</div>
					<div class={iconContainerClasses}>
						<div class={iconClasses}>
							<Clock />
						</div>
					</div>
					<div class={textClasses}>
						{$displayedTime}
					</div>
					<div class={iconContainerClasses}>
						<div class={iconClasses}>
							<MapPin />
						</div>
					</div>
					<div class={textClasses}>
						{desk.map.floor.building.location.locationname}
					</div>
					<div class={iconContainerClasses}>
						<div class={iconClasses}>
							<Building />
						</div>
					</div>
					<div class={textClasses}>
						{desk.map.floor.building.buildingname}
					</div>
					<div class={iconContainerClasses}>
						<div class={iconClasses}>
							<Cuboid />
						</div>
					</div>
					<div class={textClasses}>
						{desk.map.floor.floorname}
					</div>
					<div class={iconContainerClasses}>
						<div class={iconClasses}>
							<Armchair />
						</div>
					</div>
					<div class={textClasses}>
						{desk.desknum}
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-5 rounded-lg">
				<Button
					on:click={() => {
						editBookingState = !editBookingState;
					}}
					class="btn variant-filled-primary rounded-lg w-full h-full text-xl"
					>Edit
				</Button>
				<Button
					on:click={() => {
						deleteBookingState = !deleteBookingState;
					}}
					class="btn bg-red-400 rounded-lg w-full h-full text-xl"
					>Delete
				</Button>
			</div>
		{:else}
			<div class="grid grid-cols-3 text-center align-middle px-4 pt-5">
				<Button
					on:click={() => {
						editBookingState = false;
					}}
				>
					<ArrowLeft />
				</Button>
				<h1 class="text-center text-3xl p-3">Booking</h1>
			</div>
			<div class="h-full flex items-center justify-center">
				<div class="grid grid-cols-3 grid-rows-6 gap-7">
					<div class={iconContainerClasses}>
						<div class="rounded-3xl m-3 mx-5">
							<Calendar />
						</div>
					</div>
					<Button
						class="col-span-2 rounded-3xl flex justify-center items-center text-xl variant-filled-primary"
					>
						{editDate}
					</Button>
					<div class="card w-48 shadow-xl py-2 z-10" data-popup="popupDates">
						<ListBox>
							{#each stringDates as item}
								<ListBoxItem bind:group={editDate} name="medium" value={item} class="fortniteDates">
									{item}
								</ListBoxItem>
							{/each}
						</ListBox>
						<div class="arrow bg-surface-100-800-token" />
					</div>
					<div class={iconContainerClasses}>
						<div class={iconClasses}>
							<Clock />
						</div>
					</div>
					<RadioGroup
						class="col-span-2 btn-group rounded-3xl flex flex-row justify-center items-center bg-white"
					>
						<RadioItem
							on:change={(e) => {
								recalcDates(value);
							}}
							bind:group={value}
							name="justify"
							value={'07:00 - 13:00'}
						>
							<Sun />
						</RadioItem>
						<RadioItem
							on:change={(e) => {
								recalcDates(value);
							}}
							bind:group={value}
							name="justify"
							value={'13:00 - 20:00'}
						>
							<Moon />
						</RadioItem>
						<RadioItem
							on:change={(e) => {
								recalcDates(value);
							}}
							bind:group={value}
							name="justify"
							class="flex flex-row"
							value={'07:00 - 20:00'}
						>
							<Sun />
							<Moon />
						</RadioItem>
					</RadioGroup>
					<div class={iconContainerClasses}>
						<div class={iconClasses}>
							<MapPin />
						</div>
					</div>
					<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-gray-500">
						{desk.map.floor.building.location.locationname}
					</div>
					<div class={iconContainerClasses}>
						<div class={iconClasses}>
							<Building />
						</div>
					</div>
					<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-gray-500">
						{desk.map.floor.building.buildingname}
					</div>
					<div class={iconContainerClasses}>
						<div class={iconClasses}>
							<Cuboid />
						</div>
					</div>
					<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-gray-500">
						{desk.map.floor.floorname}
					</div>
					<div class={iconContainerClasses}>
						<div class={iconClasses}>
							<Armchair />
						</div>
					</div>
					<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-gray-500">
						{desk.desknum}
					</div>
				</div>
			</div>
			<div class="flex flex-col gap-5">
				<Button
					on:click={() => {
						if (editDate.includes('(current)')) {
							editDate = editDate.split(' ')[0];
							editBookingState = !editBookingState;
							return;
						}
						finishEditBooking(
							$currentBooking.pk_bookingid,
							editDate,
							tempMorning,
							tempAfternoon,
							tempDesk
						);
						//editBookingState = !editBookingState;
					}}
					class="btn variant-filled-primary rounded-lg w-full h-full text-xl"
					>Save Changes
				</Button>
				<Button
					on:click={() => {
						editDate = firstDate;
						editBookingState = !editBookingState;
					}}
					class="btn bg-red-400 rounded-lg w-full h-full text-xl"
				>
					Go Back
				</Button>
			</div>
		{/if}
	</div>
{/if}
