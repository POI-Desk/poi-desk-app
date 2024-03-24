<script lang="ts">
	import { selectedDesks } from '$lib/stores/extendedUserStore';
	import { dateValue, maxBookingValue, today } from '$lib/dateStore';
	import { getBookingsByDate } from '$lib/queries/booking';
	import { floorid } from '$lib/floorStore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	export let date: string;

	let rendered = false;
	$dateValue = date;

	$: {
		if ($dateValue && browser) {
			const query = new URLSearchParams($page.url.searchParams);
			query.set('date', $dateValue);
			goto(`?${query.toString()}`);
		}
	}
</script>

<div class="group w-fit shadow-around-10">
	<div class="dropdown">
		<input
			class="input border-none"
			type="date"
			id="calendar"
			min={today}
			max={maxBookingValue}
			bind:value={$dateValue}
			on:change={() => {
				const query = new URLSearchParams($page.url.searchParams);
				query.set('date', $dateValue);
				goto(`?${query.toString()}`);
			}}
		/>
	</div>
</div>

<!--{#if bookings}-->
<!--	<ul>-->
<!--		{#each bookings as booking (booking?.pk_bookingid)}-->
<!--			<li>{booking?.bookingnumber}</li>-->
<!--		{/each}-->
<!--	</ul>-->
<!--{/if}-->
