<script lang="ts">
	import {graphql} from '$houdini';
	import {dateValue, maxBookingValue, today} from "$lib/dateStore";

	$dateValue = new Date().toISOString().split('T')[0];


	export const _getBookingsByDateVariables = () => {
		return {
			date: $dateValue
		};
	};

	const store = graphql(`
		query getBookingsByDate($date: String!) @load {
			getBookingsByDate(date: $date) {
				pk_bookingid
				bookingnumber
			}
		}
	`);

	$: bookings = $store.data?.getBookingsByDate;

	const getBookings = () => {
		store.fetch({ variables: { date: $dateValue } });
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
