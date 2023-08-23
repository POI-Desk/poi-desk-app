<script lang="ts">
	import { graphql } from '$houdini';
	// import type { PageLoad } from './$houdini';
	//import DateSelection

	let visibility = 'hidden';
	let dateValue = new Date().toISOString().split('T')[0];

	function showDateSelection() {
		visibility = 'visible';
	}

	export const _getBookingsByDateVariables = () => {
		return {
			date: dateValue
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
		console.log(dateValue);
		store.fetch({ variables: { date: dateValue } });
	};
</script>

<div class="group w-fit">
	<div class="dropdown">
		<input
			class="timeselect input input-bordered"
			type="date"
			id="calendar"
			bind:value={dateValue}
			on:change={getBookings}
			placeholder="bingbong"
		/>
	</div>
</div>

{#if bookings}
	<ul>
		{#each bookings as booking (booking?.pk_bookingid)}
			<li>{booking?.bookingnumber}</li>
		{/each}
	</ul>
{/if}
