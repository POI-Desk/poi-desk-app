<script lang="ts">
	import { CachePolicy, graphql } from '$houdini';
	import { user } from '$lib/userStore';
    import { delBooking } from '$lib/mutations/booking';


    

	const deleteBooking = async (id: string) => {
		await delBooking.mutate({ id });
		await getBookings.fetch({ policy: CachePolicy.NetworkOnly });
	};
	
    $: userid = $user?.pk_userid;
	

	export const _getBookingsByUseridVariables = () => {
		return {userid};
	};


	const getBookings = graphql(`
		query getBookingsByUserid($userid: ID!) @load {
			getBookingsByUserid(userid: $userid) {
				pk_bookingid
				bookingnumber
				date
			}
		}
	`);



    $: bookings = $getBookings.data?.getBookingsByUserid;

    $: {
        if ($user) {
            getBookings.fetch({variables: {userid: $user.pk_userid}});
        }
    }


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
			{#await getBookings.fetch({variables: {userid}})}
                {console.log("fetching book")}
            {:then fetched}
				{#each bookings??[] as booking}
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
			{/await}
		</tbody>
	</table>
</div>
