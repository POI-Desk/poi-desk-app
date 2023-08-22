<script lang="ts">
	import { bookings } from '$lib/bookings';

	const deleteBooking = (id: number) => {
		bookings.update((b) => b.filter((b) => b.id !== id));
	};
</script>

<div class="overflow-x-auto">
	<table class="table">
		<!-- head -->
		<thead>
			<tr>
				<th>ID</th>
				<th>Date</th>
				<th>Time</th>
				<th />
			</tr>
		</thead>
		<tbody>
			{#each $bookings as booking (booking.id)}
				<tr>
					<th>{booking.id}</th>
					<td>{booking.date}</td>
					<td>{booking.time}</td>
					<td>
						<button
							on:click|stopPropagation={() => deleteBooking(booking.id)}
							class="btn btn-error btn-sm btn-outline">Delete</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>
