<script lang="ts">
	import { CachePolicy, graphql } from '$houdini';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { defaultLocation } from '$lib/mutations/location';
	import { getUserByid } from '$lib/queries/userQuerries';
	import { user } from '$lib/userStore';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import type { PageData } from './$types';

	export let data: PageData;

	onMount(() => {
		$user = data.session;
		getAllLocationsChange.fetch();
	});

	$: thisUser = data.res.data?.getUserById;
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

	const jwtData = data.sessionToken?.split('.')[1];
	const decodedJwt = JSON.parse(atob(jwtData ?? ''));

	const getAllLocationsChange = graphql(`
		query getAllLocationsChange {
			getAllLocations {
				pk_locationid
				locationname
			}
		}
	`);

	$: locations = $getAllLocationsChange.data?.getAllLocations;

	console.log(jwtData);
	console.log(decodedJwt);
</script>

{#if thisUser}
	<div class="rounded-lg bg-primary h-1/2 mt-5 p-2 m-2 flex flex-col gap-2">
		<div class="rounded-lg flex flex-row bg-white text-surface-900 h-1/2 p-2">
			<div class="w-1/2 flex justify-center items-center">
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img class="rounded-full h-full" referrerpolicy="no-referrer" src={decodedJwt.picture} alt="profile picture" />
			</div>
			<div class="flex flex-col w-1/2">
				<h1>{thisUser?.username}</h1>
				<hr />
				<h1>POI/AT</h1>
				<h1>{thisUser?.location?.locationname}</h1>
			</div>
		</div>
		<AlertDialog.Root>
			<AlertDialog.Trigger
				class="rounded-lg bg-white text-surface-900 h-1/6 flex flex-row justify-center items-center gap-5"
			>
				{thisUser?.location?.locationname}
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title class="text-center">Change default location</AlertDialog.Title>
					<AlertDialog.Description>
						<div class="flex flex-col items-center">
							<div class="flex justify-center items-center flex-col gap-5">
								{#each locations ?? [] as location}
									<AlertDialog.Action
										class="w-28"
										on:click={async () => {
											await defaultLocation.mutate({
												lid: location.pk_locationid
											});
											await getUserByid.fetch({ policy: CachePolicy.NetworkOnly });
											toast('Default Location changed successfully!', {
												position: 'bottom-center'
											});
										}}
									>
										{location?.locationname}
									</AlertDialog.Action>
								{/each}
							</div>
						</div>
					</AlertDialog.Description>
				</AlertDialog.Header>
			</AlertDialog.Content>
		</AlertDialog.Root>
		<div
			class="rounded-lg bg-white text-surface-900 h-1/6 flex flex-row justify-around items-center"
		>
			<div>Light Mode</div>
			<div class="flex items-center">
			</div>
		</div>
		<!--
		<div class="rounded-lg bg-green-500 h-1/6 flex items-center justify-around">
			<div>Add to Outlook</div>
			<div class="flex items-center">
				<SlideToggle name="addToOutlookChanger" bind:checked={addToOutlookTrue} />
			</div>
		</div>
		-->
		Statistics:
		<div class="rounded-lg h-1/6 flex flex-row gap-2">
			<div class="w-1/2 flex justify-center items-center bg-white text-surface-900 rounded-lg">
				{currentMonthName}
			</div>
			<div class="w-1/2 flex justify-center items-center bg-white text-surface-900 rounded-lg">
				{amountOfBookingsThisMonth}
			</div>
		</div>
		<!-- button to change into a different role-->
		{#if thisUser.roles && thisUser.roles[0].rolename === 'Admin'}
			<div class="rounded-lg bg-green-500 h-1/6 flex flex-row justify-center items-center">
				<a class="btn variant-filled-primary" href="./admin">Change {thisUser.roles[0].rolename}</a>
			</div>
		{/if}
		{#if thisUser.roles && thisUser.roles[0].rolename === 'Super Admin'}
			<div class="rounded-lg bg-green-500 h-1/6 flex flex-row justify-center items-center">
				<a class="btn variant-filled-primary" href="./admin">Change {thisUser.roles[0].rolename}</a>
			</div>
		{/if}
	</div>
	<Button
		variant="outline"
		on:click={() => {
			console.log('test');
			toast('Event has been created', {
				description: 'Sunday, December 03, 2023 at 9:00 AM',
				action: {
					label: 'Undo',
					onClick: () => console.log('Undo')
				},
				position: 'bottom-center'
			});
		}}
	>
		Show Toast
	</Button>
{/if}

<style>
	hr {
		border: 1px solid black;
	}
</style>
