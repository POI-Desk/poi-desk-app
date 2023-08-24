<script lang="ts">
	import { delBooking } from '$lib/mutations/booking';
	import { CachePolicy, fetch } from '$houdini';
	import type { PageData } from './$houdini'; 

	export let data: PageData;

	$: ({ GetAllBookings } = data);

	const deleteBooking = async (id: string) => {
		await delBooking.mutate({ id: id });
		await data.GetAllBookings.fetch({ policy: CachePolicy.NetworkOnly });
	};
</script>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>ID</th>
				<th>Number</th>
				<th>Date</th>
				<th />
			</tr>
		</thead>
		<tbody>
			{#if $GetAllBookings.data?.allBookings}
				{#each $GetAllBookings.data?.allBookings as booking}
					<tr>
						<th>{booking?.pk_bookingid}</th>
						<td>{booking?.bookingnumber}</td>
						<td>{booking?.date}</td>
						<td>
							<button
								on:click|stopPropagation={async () => {
									await deleteBooking(booking?.pk_bookingid ?? 'lol du stinkst');
								}}
								class="btn btn-error btn-sm btn-outline">Delete</button
							>
						</td>
					</tr>
				{/each}
			{/if}
		</tbody>
	</table>
</div>
