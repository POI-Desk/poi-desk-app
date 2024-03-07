<script lang="ts">
  import { CachePolicy } from "$houdini";
  import { user } from "$lib/stores/userStore";
  import { getModalStore, LightSwitch, type ModalSettings, modeCurrent, modeUserPrefers } from "@skeletonlabs/skeleton";
  import { Pen } from "lucide-svelte";
  import { getUserById } from "$lib/queries/userQueries";
  import { goto } from "$app/navigation";
  import { isExtended } from "$lib/stores/extendedUserStore";
  import { curPage } from "$lib/stores/pageStore";
  import { onMount } from "svelte";
  import { User } from 'lucide-svelte';

  $: if ($user?.pk_userid) getUserById.fetch({ variables: { id: $user?.pk_userid }, policy: CachePolicy.NetworkOnly });
  $: thisUser = $getUserById.data?.getUserById;

  $: bookings = thisUser?.bookings;
  const currentMonth = new Date().getMonth();
  // get currentMonth in a human readable format
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  const currentMonthName = months[currentMonth];
  const currentYear = new Date().getFullYear();

  $: bookingsThisMonth = bookings?.filter((booking: any) => {
    const bookingDate = new Date(booking.date);
    return bookingDate.getMonth() === currentMonth && bookingDate.getFullYear() === currentYear;
  });

  $: amountOfBookingsThisMonth = bookingsThisMonth?.length;

  const modal: ModalSettings = {
    type: "component",
    component: "modalChangeDefaultLocation"
  };

  const modalStore = getModalStore();

  onMount(() => {
    $modeCurrent = $modeUserPrefers ?? false;
  });
</script>

{#if thisUser}
  <div class="rounded-3xl variant-filled-primary h-1/2 mt-5 p-2 m-2 flex flex-col gap-2">
    <div class="rounded-3xl grid grid-cols-2 bg-white text-surface-900 h-1/2 p-2 items-center">
      <div class="flex justify-center">
        <div class="rounded-full bg-tertiary-100-800-token p-5 text-token">
          <User size = 110px/>
            <!--        <img class="rounded-full" src="/src/images/profile.jpg" alt="profile picture" />-->
        </div>
      </div>
      <div class="flex flex-col">
        <h1>{thisUser?.username}</h1>
        <hr />
        <h1>POI/AT</h1>
        <h1>{thisUser?.location?.locationname}</h1>
      </div>
    </div>
    <button
      on:click={async () => {
				modalStore.trigger(modal);
			}}
      class="rounded-3xl bg-white text-surface-900 h-1/6 flex flex-row justify-center items-center gap-5 p-5"
    >
      <div class="grid grid-cols-2 gap-5 variant-filled-primary rounded-full p-4">
        <span>{thisUser?.location?.locationname}</span>
        <Pen />
      </div>
    </button
    >
    <div
      class="rounded-3xl bg-white text-surface-900 h-1/6 flex flex-row justify-around items-center"
    >
      <div>Change Theme</div>
      <LightSwitch />
    </div>
    Statistics:
    <div class="rounded-3xl h-1/6 flex flex-row gap-2">
      <div class="w-1/2 flex justify-center items-center bg-white text-surface-900 rounded-3xl">
        {currentMonthName}
      </div>
      <div class="w-1/2 flex justify-center items-center bg-white text-surface-900 rounded-3xl">
        {amountOfBookingsThisMonth}
      </div>
    </div>
    <!-- button to change into a different role-->
    {#if thisUser?.roles[0].rolename === 'Admin'}
      <div class="rounded-3xl bg-green-500 h-1/6 flex flex-row justify-center items-center">
        <a class="btn variant-filled-primary" href="./admin">Change {thisUser?.roles[0].rolename}</a>
      </div>
    {/if}
    {#if thisUser?.roles[0].rolename === 'Super Admin'}
      <div class="rounded-3xl bg-green-500 h-1/6 flex flex-row justify-center items-center">
        <a class="btn variant-filled-primary" href="./admin">Change {thisUser?.roles[0].rolename}</a>
      </div>
    {/if}
  </div>
{/if}

<button class="btn variant-filled-primary" on:click={() => {
	$isExtended = false;
	$curPage = '/'
	goto('/');
}}
>Default User
</button
>

<button class="btn variant-filled-primary" on:click={() => {
	$curPage = '/extendedUser'
	goto('/extendedUser')
}}
>Extended User
</button
>

<button class="btn variant-filled-primary" on:click={() => goto('/admin')}>Admin</button>

<style>
    hr {
        border: 1px solid black;
    }
</style>
