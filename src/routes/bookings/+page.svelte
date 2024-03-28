<script>
	import BookingsOfUser from '$components/PersonalBookingComponents/BookingsOfUser.svelte';
	import * as Tabs from '$lib/components/ui/tabs';

	let isCurrentBookings = true;
</script>

<div class="flex flex-col items-center justify-center">
	<div class="flex flex-row w-full justify-center p-5">
		<!-- <RadioGroup
      border="none"
      padding="px-5 py-2"
      active="variant-filled-primary"
      hover="hover:variant-soft-primary"
    >
      <RadioItem bind:group={isCurrentBookings} name="current" value={true}>current</RadioItem>
      <RadioItem bind:group={isCurrentBookings} name="past" value={false}>past</RadioItem>
    </RadioGroup> -->
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
