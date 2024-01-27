<script lang="ts">
	import { selectedDesks } from "$lib/stores/extendedUserStore";
	import { dateValue, maxBookingValue, today } from "$lib/dateStore";
	import { getBookingsByDate } from '$lib/queries/booking';
	import { floorid } from '$lib/floorStore';

	$dateValue = new Date().toISOString().split('T')[0];


	export const _getBookingsByDateVariables = () => {
		return {
			date: $dateValue
		};
	};

	let visibility = 'hidden';
	$dateValue = new Date().toISOString().split('T')[0];
	console.log($dateValue);

	const getBookings = () => {
		$selectedDesks = [];
		getBookingsByDate.fetch({ variables: { date: $dateValue, floorId: $floorid } });
	};

	

</script>

<div class="group w-fit">
	<div class="dropdown">
		<input
			class="timeselect input input-bordered"
			type="date"
			id="calendar"
			min="{today}"
			max="{maxBookingValue}"
			bind:value={$dateValue}
			on:change={getBookings}
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
