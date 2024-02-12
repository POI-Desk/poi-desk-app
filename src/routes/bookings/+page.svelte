<script>
  import BookingsOfUser from "$components/PersonalBookingComponents/BookingsOfUser.svelte";
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";

  let isCurrentBookings = true;
</script>

<div class="flex flex-col items-center justify-center">
  <div class="flex flex-row w-full justify-center p-5">
    <RadioGroup
      border="none"
      padding="px-5 py-2"
      active="variant-filled-primary"
      hover="hover:variant-soft-primary"
    >
      <RadioItem bind:group={isCurrentBookings} name="current" value={true}>current</RadioItem>
      <RadioItem bind:group={isCurrentBookings} name="past" value={false}>past</RadioItem>
    </RadioGroup>
  </div>
  <BookingsOfUser {isCurrentBookings}></BookingsOfUser>
</div>
