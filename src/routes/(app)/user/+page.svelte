<script lang="ts">
  import { CachePolicy } from "$houdini";
  import { user } from "$lib/stores/userStore";
  import { getModalStore, LightSwitch, type ModalSettings, modeCurrent, modeUserPrefers } from "@skeletonlabs/skeleton";
  import { Pen, User } from "lucide-svelte";
  import { getUserById } from "$lib/queries/userQueries";
  import { onMount } from "svelte";

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

  const sectionStyle = "rounded-3xl bg-white text-surface-900 flex flex-row justify-around items-center p-5";


  const modalRoleSelection: ModalSettings = {
    type: "component",
    component: "modalRoleSelection"
  };
</script>

{#if thisUser}
  <div class="rounded-3xl variant-filled-primary mt-5 p-2 m-2 flex flex-col gap-2">
    <div class="rounded-3xl grid grid-cols-2 bg-white text-surface-900 h-1/2 p-2 items-center">
      <div class="flex justify-center">
        <div class="rounded-full bg-tertiary-100-800-token p-5 text-token">
          <User size="110px" />
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

    <div class="grid grid-cols-2 gap-2">
      <div class="{sectionStyle}">
        <button
          on:click={async () => {
				    modalStore.trigger(modal);
		  	  }}
          class="rounded-3xl flex flex-row justify-center items-center btn variant-filled-primary"
        >
          <span>{thisUser?.location?.locationname}</span>
          <Pen />
        </button>
      </div>

      <div class="{sectionStyle}">
        <button class="btn variant-filled-primary" on:click={() => modalStore.trigger(modalRoleSelection)}>Switch Role</button>
      </div>
    </div>

    <div class="{sectionStyle}">
      <div>Change Theme</div>
      <LightSwitch />
    </div>

    <div class="rounded-3xl grid grid-cols-2 gap-2">
      <div class="flex justify-center items-center text-center bg-white text-surface-900 rounded-3xl p-5">
        <span>Bookings in {currentMonthName}</span>
      </div>
      <div class="flex justify-center items-center bg-white text-surface-900 rounded-3xl p-5">
        <span>{amountOfBookingsThisMonth}</span>
      </div>
    </div>

    <!-- button to change into a different role-->
    {#if thisUser?.roles[0].rolename === 'Admin'}
      <div class="{sectionStyle}">
        <a class="btn variant-filled-primary" href="./admin">Change {thisUser?.roles[0].rolename}</a>
      </div>
    {/if}
    {#if thisUser?.roles[0].rolename === 'Super Admin'}
      <div class="{sectionStyle}">
        <a class="btn variant-filled-primary" href="./admin">Change {thisUser?.roles[0].rolename}</a>
      </div>
    {/if}
  </div>
{/if}


<style>
    hr {
        border: 1px solid black;
    }
</style>
