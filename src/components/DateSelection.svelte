<script lang="ts">
	import { selectedDesks } from "$lib/stores/extendedUserStore";
	import { dateValue, maxBookingValue, today } from "$lib/stores/dateStore";
	import { getBookingsByDate } from '$lib/queries/bookingQueries';
	import { floorid } from '$lib/stores/floorStore';

	$dateValue = new Date().toISOString().split('T')[0];


	export const _getBookingsByDateVariables = () => {
		return {
			date: $dateValue
		};
	};

	let visibility = 'hidden';
	$dateValue = new Date().toISOString().split('T')[0];

	const getBookings = () => {
		$selectedDesks = [];
		getBookingsByDate.fetch({ variables: { date: $dateValue, floorId: $floorid } });
	};

</script>

<div class="group w-fit">
	<div class="dropdown">
		<input
			class="input border-none shadow-md"
			type="date"
			id="calendar"
			min="{today}"
			max="{maxBookingValue}"
			bind:value={$dateValue}
			on:change={getBookings}
		/>
	</div>
</div>
