<script lang="ts">
	import { dateValue, maxBookingValue, today } from '$lib/dateStore';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';
	import { Input } from '$lib/components/ui/input';

	export let date: string;

	$dateValue = date;

	$: {
		if ($dateValue && browser) {
			const query = new URLSearchParams($page.url.searchParams);
			query.set('date', $dateValue);
			goto(`?${query.toString()}`);
		}
	}
</script>

<div class="group w-fit">
	<div class="dropdown">
		<Input
			class="input border-none bg-primary text-primary-foreground"
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
