<script lang="ts">
	import { currentBooking, displayedTime, getBookings } from "$lib/bookingStore";
	import { delBooking } from "$lib/mutations/booking";
	import { getModalStore, popup, type PopupSettings } from "@skeletonlabs/skeleton";
	import { Armchair, ArrowLeft, Building, Calendar, Check, Clock, Cuboid, MapPin, X } from "lucide-svelte";
	import type { Booking } from "$lib/types/bookingTypes";
	import { user } from "$lib/userStore";
	import { CachePolicy, graphql } from "$houdini";

	$: {
		if ($currentBooking.ismorning && $currentBooking.isafternoon) {
			$displayedTime = '07:00 - 20:00';
		} else if ($currentBooking.ismorning) {
			$displayedTime = '07:00 - 13:00';
		} else if ($currentBooking.isafternoon) {
			$displayedTime = '13:00 - 20:00';
		}
	}

	console.log($currentBooking);

	const modalStore = getModalStore();

	let desk = $currentBooking.desk;
	let deleteBookingState: boolean = false;
	let editBookingState: boolean = false;
	let comboboxValue: string = $currentBooking.date;

	const popupCombobox: PopupSettings = {
		event: 'focus-click',
		target: 'popupCombobox',
		placement: 'bottom',
		closeQuery: '.listbox-item'
	};

	// const deleteBooking = async (id: string) => {
	// 	$userBookings = $userBookings.filter((booking) => booking.pk_bookingid != id);
	// 	await delBooking.mutate({ id });
	// 	modalStore.close();
	// };

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

		if (booking.bookingnumber.includes("EXT-ID")) {
			const extId = booking.bookingnumber.split("EXT-ID")[1];

			if (extId !== $user.pk_userid) return;

			await getBookingsByNumContains.fetch({ variables: { string: extId } });
			console.log(extendedBookings);
			for (const b of extendedBookings ?? []) {
				console.log(b);
				await delBooking.mutate({ id: b.pk_bookingid });
			}
		} else {
			await delBooking.mutate({ id });
		}

		await getBookings.fetch({ policy: CachePolicy.NetworkOnly }); //TODO: DONT FETCH THIS! DELETE FROM ARRAY

		modalStore.close();
	};
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl">
		{#if deleteBookingState}
			<div class="flex flex-col justify-center items-center gap-5">
				<h1 class="text-center text-3xl p-3">Buchung</h1>
				<p>Do you really want to delete this booking?</p>
				<div class="flex gap-5">
					<button
						on:click={async () => {
							await deleteBooking($currentBooking);
						}}
						class="btn bg-green-400 rounded-full"
					>
						<Check />
					</button>
					<button
						on:click={() => {
							deleteBookingState = !deleteBookingState;
						}}
						class="btn bg-red-400 rounded-full"
					>
						<X />
					</button>
				</div>
			</div>
		{:else if !editBookingState}
			<div>
				<button
					on:click={() => {
						modalStore.close();
					}}
					class="absolute left-7 top-11 text-black px-4 py-2 rounded-full"
				>
					<ArrowLeft />
				</button>
				<h1 class="text-center text-3xl p-3">Buchung</h1>
				<div class="h-full flex items-center justify-center">
					<div class="grid grid-cols-3 grid-rows-6 gap-7">
						<div class="rounded-3xl flex justify-center bg-white">
							<div class="rounded-3xl m-3 mx-5">
								<Calendar />
							</div>
						</div>
						<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
							{comboboxValue}
						</div>
						<div class="rounded-3xl flex justify-center bg-white">
							<div class="rounded-3xl m-3 mx-5">
								<Clock />
							</div>
						</div>
						<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
							{$displayedTime}
						</div>
						<div class="rounded-3xl flex justify-center bg-white">
							<div class="rounded-3xl m-3 mx-5">
								<MapPin />
							</div>
						</div>
						<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
							{desk.floor.building.location.locationname}
						</div>
						<div class="rounded-3xl flex justify-center bg-white">
							<div class="rounded-3xl m-3 mx-5">
								<Building />
							</div>
						</div>
						<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
							{desk.floor.building.buildingname}
						</div>
						<div class="rounded-3xl flex justify-center bg-white">
							<div class="rounded-3xl m-3 mx-5">
								<Cuboid />
							</div>
						</div>
						<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
							{desk.floor.floorname}
						</div>
						<div class="rounded-3xl flex justify-center bg-white">
							<div class="rounded-3xl m-3 mx-5">
								<Armchair />
							</div>
						</div>
						<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
							{desk.desknum}
						</div>
					</div>
				</div>
				<div class=" mt-10 flex flex-col gap-5 rounded-full">
					<button
						on:click={() => {
							editBookingState = !editBookingState;
						}}
						class="btn bg-blue-400 rounded-full w-full h-full text-xl">Edit</button
					>
					<button
						on:click={() => {
							deleteBookingState = !deleteBookingState;
						}}
						class="btn bg-red-400 rounded-full w-full h-full text-xl">Delete</button
					>
				</div>
			</div>
		{:else}
			<div>
				<button
					on:click={() => {
						modalStore.close();
					}}
					class="absolute left-7 top-11 text-black px-4 py-2 rounded-full"
				>
					<ArrowLeft />
				</button>
				<h1 class="text-center text-3xl p-3">Buchung</h1>
				<div class="h-full flex items-center justify-center">
					<div class="grid grid-cols-3 grid-rows-6 gap-7">
						<div class="rounded-3xl flex justify-center bg-white">
							<div class="rounded-3xl m-3 mx-5">
								<Calendar />
							</div>
						</div>
						<button
							class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white"
							use:popup={popupCombobox}
						>
							{comboboxValue}
						</button>
						<div class="card w-48 shadow-xl py-2" data-popup="popupCombobox">
							<div>
								{#each ['2024-1-04', '2024-1-05', '2024-1-06'] as item}
									<button on:click={() => {comboboxValue = item}} class="btn bg-green-400">
										{item}
									</button>
								{/each}
							</div>
							<div class="arrow bg-surface-100-800-token" />
						</div>
						<div class="rounded-3xl flex justify-center bg-white">
							<div class="rounded-3xl m-3 mx-5">
								<Clock />
							</div>
						</div>
						<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
							{$displayedTime}
						</div>
						<div class="rounded-3xl flex justify-center bg-white">
							<div class="rounded-3xl m-3 mx-5">
								<MapPin />
							</div>
						</div>
						<div
							class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-gray-500"
						>
							{desk.floor.building.location.locationname}
						</div>
						<div class="rounded-3xl flex justify-center bg-white">
							<div class="rounded-3xl m-3 mx-5">
								<Building />
							</div>
						</div>
						<div
							class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-gray-500"
						>
							{desk.floor.building.buildingname}
						</div>
						<div class="rounded-3xl flex justify-center bg-white">
							<div class="rounded-3xl m-3 mx-5">
								<Cuboid />
							</div>
						</div>
						<div
							class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-gray-500"
						>
							{desk.floor.floorname}
						</div>
						<div class="rounded-3xl flex justify-center bg-white">
							<div class="rounded-3xl m-3 mx-5">
								<Armchair />
							</div>
						</div>
						<div
							class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-gray-500"
						>
							{desk.desknum}
						</div>
					</div>
				</div>
				<div class=" mt-10 flex flex-col gap-5">
					<button on:click={() => {}} class="btn bg-blue-400 rounded-full w-full h-full text-xl"
						>Change Desk</button
					>
					<button
						on:click={() => {
							editBookingState = !editBookingState;
						}}
						class="btn bg-blue-400 rounded-full w-full h-full text-xl">Save Changes</button
					>
				</div>
			</div>
		{/if}
	</div>
{/if}
