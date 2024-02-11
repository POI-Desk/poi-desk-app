<script>
  import BookingsOfUser from "$components/PersonalBookingComponents/BookingsOfUser.svelte";

  let isCurrentBookings = true;
</script>

<div class="flex flex-col items-center justify-center">

<!--  TODO RADIO GROUP VERWENDEN-->
  <div class="flex flex-row w-full justify-center p-5">
    <button class="border-b-2 text-xl font-medium text-primary-900 m-10 p-2 px-10" on:click={() => {isCurrentBookings = true}}>current</button>
    <button class="border-b-2 text-xl font-medium text-primary-900 m-10 p-2 px-10" on:click={() => {isCurrentBookings = false}}>past</button>
  </div>

  <BookingsOfUser {isCurrentBookings}></BookingsOfUser>
</div>
