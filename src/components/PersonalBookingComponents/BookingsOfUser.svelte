<script lang="ts">
	import { invalidateAll } from '$app/navigation';
	import { CachePolicy } from '$houdini';
	import { user } from '$lib/userStore';
	import { getBookings } from '$lib/bookingStore';
	import BookingCard from '$components/PersonalBookingComponents/BookingCard.svelte';
	import { onMount } from 'svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import { refreshTrigger } from '$lib/bookingStore';

	let bookings: any;
	export let isCurrentBookings = true;
	let penis: boolean = true;

	const fetchBookings = async (refresh: boolean) => {
		await getBookings.fetch({
			variables: { isCurrent: isCurrentBookings },
			policy: CachePolicy.NetworkOnly
		});
		return $getBookings.data?.getBookingsByUserid;
	};

	onMount(() => {
		fetchBookings(true);
	});

	const handleMessage = async () => {
		$refreshTrigger = !$refreshTrigger
	};

	$: bookings = $getBookings.data?.getBookingsByUserid;

	$: {
		if ($user.pk_userid != '') {
			getBookings.fetch({
				variables: { isCurrent: isCurrentBookings }
			});
		}
	}
</script>

{#if penis}
	{#await fetchBookings($refreshTrigger)}
		<p />
	{:then fetched}
		{#each fetched ?? [] as booking}
			<BookingCard thisBooking={booking} on:updateBookings={handleMessage} />
		{/each}
	{/await}
{/if}

{#if bookings?.length === 0}
	<p class="text-4xl text-primary-500">
		{isCurrentBookings ? 'No current bookings' : 'No past bookings'}
	</p>
{/if}
