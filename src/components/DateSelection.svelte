<script lang="ts">
	import { getBookingsByDate } from '$lib/queries/booking';
	import { dateValue } from '../lib/dateStore';

	export const _getBookingsByDateVariables = () => {
		return {
			date: $dateValue
		};
	};

	let visibility = 'hidden';
	$dateValue = new Date().toISOString().split('T')[0];

	const getBookings = () => {
		getBookingsByDate.fetch({ variables: { date: $dateValue } });
	};
</script>

<div class="group w-fit">
	<div class="dropdown">
		<input
			class="timeselect input input-bordered"
			type="date"
			id="calendar"
			bind:value={$dateValue}
			on:change={getBookings}
			placeholder="bingbong"
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
