<script lang="ts">
	import { CachePolicy } from '$houdini';
	import { user } from '$lib/userStore';
	import { SlideToggle, type ModalSettings, getModalStore } from '@skeletonlabs/skeleton';
	import { Pen } from 'lucide-svelte';
	import { getUserById } from '$lib/queries/userQuerries';

	$: getUserById.fetch({ variables: { id: $user?.pk_userid }, policy: CachePolicy.NetworkOnly });
	$: thisUser = $getUserById.data?.getUserById;
	$: console.log(thisUser);
	let lightModeTrue = true;
	// let addToOutlookTrue = false;

	$: bookings = thisUser?.bookings;
	const currentMonth = new Date().getMonth();
	// get currentMonth in a human readable format
	const months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December'
	];
	const currentMonthName = months[currentMonth];
	const currentYear = new Date().getFullYear();
	$: bookingsThisMonth = bookings?.filter((booking: any) => {
		const bookingDate = new Date(booking.date);
		return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
	});
	$: amountOfBookingsThisMonth = bookingsThisMonth?.length;

	const modal: ModalSettings = {
		type: 'component',
		component: 'modalChangeDefaultLocation'
	};

	const modalStore = getModalStore();
</script>

<a class="btn variant-filled-primary" href="./">Go the fuck back</a>
{#if thisUser}
	<div class="rounded-3xl bg-red-500 h-1/2 mt-5 p-2 m-2 flex flex-col gap-2">
		<div class="rounded-3xl flex flex-row bg-green-500 h-1/2 p-2">
			<div class="w-1/2 flex justify-center items-center">
				<img class="rounded-full h-full" src="/src/images/cover.jpg" alt="profile picture" />
			</div>
			<div class="flex flex-col w-1/2">
				<h1>{thisUser?.username}</h1>
				<hr />
				<h1>POI/AT</h1>
				<h1>{thisUser?.location?.locationname}</h1>
			</div>
		</div>
		<button
			on:click={async () => {
				modalStore.trigger(modal);
			}}
			class="rounded-3xl bg-green-500 h-1/6 flex flex-row justify-center items-center gap-5"
		>
			<div>
				{thisUser?.location?.locationname}
			</div>
			<Pen /></button
		>
		<div class="rounded-3xl bg-green-500 h-1/6 flex flex-row justify-around items-center">
			<div>Light Mode</div>
			<div class="flex items-center">
				<SlideToggle name="themeChanger" bind:checked={lightModeTrue} />
			</div>
		</div>
		<!--
		<div class="rounded-3xl bg-green-500 h-1/6 flex items-center justify-around">
			<div>Add to Outlook</div>
			<div class="flex items-center">
				<SlideToggle name="addToOutlookChanger" bind:checked={addToOutlookTrue} />
			</div>
		</div>
		-->
		Statistics:
		<div class="rounded-3xl bg-green-500 h-1/6 flex flex-row gap-2">
			<div class="w-1/2 flex justify-center items-center bg-yellow-500 rounded-3xl">
				{currentMonthName}
			</div>
			<div class="w-1/2 flex justify-center items-center bg-yellow-500 rounded-3xl">
				{amountOfBookingsThisMonth}
			</div>
		</div>
		<!-- button to change into a different role-->
		{#if thisUser.roles[0].rolename === 'Admin'}
			<div class="rounded-3xl bg-green-500 h-1/6 flex flex-row justify-center items-center">
				<a class="btn variant-filled-primary" href="./admin">Change {thisUser.roles[0].rolename}</a>
			</div>
		{/if}
		{#if thisUser.roles[0].rolename === 'Super Admin'}
			<div class="rounded-3xl bg-green-500 h-1/6 flex flex-row justify-center items-center">
				<a class="btn variant-filled-primary" href="./admin">Change {thisUser.roles[0].rolename}</a>
			</div>
		{/if}
	</div>
{/if}

<style>
	hr {
		border: 1px solid black;
	}
</style>
