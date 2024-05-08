<script>
	import BookingsOfUser from '$components/PersonalBookingComponents/BookingsOfUser.svelte';
	import * as Tabs from '$lib/components/ui/tabs';

	let isCurrentBookings = true;
</script>

<div class="flex flex-col items-center justify-center">
	<div class="flex flex-row w-full justify-center p-5">
		<Tabs.Root value="current">
			<Tabs.List>
				<Tabs.Trigger
					value="current"
					on:click={() => {
						isCurrentBookings = true;
					}}>Current</Tabs.Trigger
				>
				<Tabs.Trigger
					value="past"
					on:click={() => {
						isCurrentBookings = false;
					}}>Past</Tabs.Trigger
				>
			</Tabs.List>
		</Tabs.Root>
	</div>
	<BookingsOfUser {isCurrentBookings} />
</div>
