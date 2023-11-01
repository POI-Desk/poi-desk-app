<script lang="ts">
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { interval, selectedDesk } from '$lib/bookingStore';
	import { dateValue } from '$lib/dateStore';
	import { bookDesk } from '$lib/mutations/booking';
	import { user } from '$lib/userStore';
	import BookingDeskState from '$components/SetBookingComponents/BookingDeskState.svelte';

	//icons
	import { Calendar, Clock, MapPin, Building, Armchair, Cuboid } from 'lucide-svelte';


	$interval.morning = false;
	$interval.afternoon = false;

	async function finishBooking() {
		console.log($dateValue);
		console.log($interval);
		console.log($user.pk_userid)
		console.log($selectedDesk.pk_deskid);
		const value = await bookDesk.mutate({
			booking: {
				date: $dateValue,
				ismorning: $interval.morning,
				isafternoon: $interval.afternoon,
				userid: $user.pk_userid,
				deskid: $selectedDesk.pk_deskid
			}
		});
		console.log(value);
		modalStore.close();
	}

	function onExitHandler() {
		modalStore.close();
	}

	let date: Date = new Date($dateValue);

	let time: string = 'default';

	let stepperLock: boolean = true;
	$: stepperLock = $interval.morning === false && $interval.afternoon === false;

	let selection: boolean = true;

	const modalStore = getModalStore();

	const cBase = 'card p-4 shadow-xl space-y-4';

	function whenSelection() {
		selection = !selection;
	}

	console.log($selectedDesk);

	window.addEventListener('popstate', () => {
		console.log('User clicked back button');
		modalStore.close();
	});
</script>

{#if $modalStore[0]}
	<div class="{cBase} rounded-xl w-screen h-screen flex flex-col bg-slate-200">
		{#if selection}
			<div class="grid grid-cols-7 row-auto gap-4 text-center basis-full">
				<div class="col-span-7 bg-red-500">
					{$selectedDesk.desknum}
					<br /> CURRENTLY NOT WORKING
				</div>
				<BookingDeskState shownInterval="morning" />
				<!---->
				<BookingDeskState shownInterval="afternoon" />

				<div class="col-span-7 row-span-2 bg-red-500">
					<div class="rounded-3xl w-full h-full bg-white">CURRENTLY NOT WORKING</div>
				</div>
				<div class="col-span-7 row-span-1 bg-red-500">
					<button
						on:click={() => whenSelection()}
						class="btn rounded-3xl w-full h-full text-xl bg-white">Buchen</button
					>
				</div>
			</div>
		{:else}
			<h1 class="text-center text-3xl">Buchung</h1>
			<div class="h-full flex items-center justify-center">
				<div class="grid grid-cols-3 grid-rows-6 gap-7">
					<div class="rounded-3xl flex justify-center bg-white">
						<div class="rounded-3xl m-3 mx-5">
							<Calendar />
						</div>
					</div>
					<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
						{date.toLocaleDateString('de-DE')}
					</div>
					<div class="rounded-3xl flex justify-center bg-white">
						<div class="rounded-3xl m-3 mx-5">
							<Clock />
						</div>
					</div>
					<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
						{time}
					</div>
					<div class="rounded-3xl flex justify-center bg-white">
						<div class="rounded-3xl m-3 mx-5">
							<MapPin />
						</div>
					</div>
					<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
						{$user.location?.locationname}
					</div>
					<div class="rounded-3xl flex justify-center bg-white">
						<div class="rounded-3xl m-3 mx-5">
							<Building />
						</div>
					</div>
					<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
						{$selectedDesk.floor.building.buildingname}
					</div>
					<div class="rounded-3xl flex justify-center bg-white">
						<div class="rounded-3xl m-3 mx-5">
							<Cuboid />
						</div>
					</div>
					<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
						{$selectedDesk.floor.floorname}
					</div>
					<div class="rounded-3xl flex justify-center bg-white">
						<div class="rounded-3xl m-3 mx-5">
							<Armchair />
						</div>
					</div>
					<div class="col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white">
						{$selectedDesk.desknum}
					</div>
				</div>
			</div>
			<button on:click={() => finishBooking()} class="btn rounded-3xl text-xl bg-indigo-500"
				>Buchen</button
			>
		{/if}
	</div>
{/if}