<script lang="ts">
	import {
		getUserInfoStore,
		graphql,
		type getUserInfo$result,
		type QueryResult,
		CachePolicy
	} from '$houdini';
	import { Moon, Pen, Sun } from 'lucide-svelte';
	type getUserInfo$input = import('$houdini').getUserInfo$input;
	import { onMount } from 'svelte';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { Button } from '$lib/components/ui/button';
	import { defaultLocation } from '$lib/mutations/location';
	import { getUserByid } from '$lib/queries/userQuerries';
	import { toggleMode } from 'mode-watcher';
	import { toast } from 'svelte-sonner';

	export let userContent: QueryResult<getUserInfo$result, getUserInfo$input> | undefined;
	export let sessionToken: string | undefined;

	const jwtData = sessionToken?.split('.')[1];
	const decodedJwt = JSON.parse(atob(jwtData ?? ''));

	const getAllLocationsChange = graphql(`
		query getAllLocationsChange {
			getAllLocations {
				pk_locationid
				locationname
			}
		}
	`);

	$: thisUser = userContent?.data?.getUserById;
	onMount(() => {
		getAllLocationsChange.fetch();
	});

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

	const getAllLocationsChangeDrawer = graphql(`
		query getAllLocationsChangeDrawer {
			getAllLocations {
				pk_locationid
				locationname
			}
		}
	`);

	$: locations = $getAllLocationsChangeDrawer.data?.getAllLocations;
</script>

{#if thisUser}
	<div class="rounded-lg bg-primary h-full p-2 m-2 flex flex-col gap-2">
		<div class="rounded-lg flex flex-row bg-white text-surface-900 h-1/2 p-2">
			<div class="w-1/2 flex items-center">
				<!-- svelte-ignore a11y-img-redundant-alt -->
				<img class="rounded-lg h-full" referrerpolicy="no-referrer" alt="profile picture" src={decodedJwt.picture} />
			</div>
			<div class="flex flex-col w-1/2">
				<h1>{thisUser?.username}</h1>
				<hr />
				<h1>POI/AT</h1>
				<h1>{thisUser?.location?.locationname}</h1>
			</div>
		</div>
		<AlertDialog.Root closeOnOutsideClick={true}>
			<AlertDialog.Trigger
				class="rounded-lg bg-white text-surface-900 h-1/6 flex flex-row justify-center items-center gap-5"
			>
				<p>{thisUser?.location?.locationname}</p>
				<Pen />
			</AlertDialog.Trigger>
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title class="text-center">Change default location</AlertDialog.Title>
					<AlertDialog.Description>
						<div class="flex flex-col items-center">
							<div class="flex justify-center items-center flex-col gap-5">
								{#each locations ?? [] as location}
									<!-- svelte-ignore missing-declaration -->
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
				<Button on:click={toggleMode} variant="outline" size="icon">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
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
		<p class="text-white">Statistics:</p>
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
{/if}

<style>
	hr {
		border: 1px solid black;
	}
</style>
