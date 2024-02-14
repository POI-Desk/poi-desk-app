<script lang="ts">
  import { getModalStore } from "@skeletonlabs/skeleton";
  import { interval } from "$lib/bookingStore";
  import { dateValue, todaysDate } from "$lib/dateStore";
  import { bookDesk } from "$lib/mutations/booking";
  import { user } from "$lib/userStore";

  //icons
  import { Armchair, ArrowLeft, Building, Calendar, Clock, Cuboid, MapPin, User, X } from "lucide-svelte";
  import { refreshDesks } from "$lib/refreshStore";
  import { selectedDesks, selectedUsers } from "$lib/stores/extendedUserStore";


  async function finishBooking() {
    const extendedid = "EXTID" + todaysDate.getTime() + "+" + $user.pk_userid;

    for (const desk of $selectedDesks) {
      const i = $selectedDesks.indexOf(desk);
      const value = await bookDesk.mutate({
        booking: {
          date: $dateValue,
          ismorning: $interval.morning,
          isafternoon: $interval.afternoon,
          userid: $selectedUsers[i].pk_userid,
          deskid: desk.pk_deskid,
          extendedid: extendedid
        }
      });
    }
    $selectedDesks = [];
    $refreshDesks = !$refreshDesks;
    modalStore.close();
  }

  function onExitHandler() {
    modalStore.close();
    $dateValue = new Date().toISOString().split("T")[0];
  }

  let date: Date = new Date($dateValue);

  const modalStore = getModalStore();

  const cBase = "card p-4 shadow-xl space-y-4";

  let currentPage = "start";

  window.addEventListener("popstate", () => {
    modalStore.close();
  });

  const iconContainerClasses = "rounded-3xl flex justify-center variant-filled-tertiary";
  const textClasses = "col-span-2 rounded-3xl flex justify-center items-center text-xl bg-white";
</script>

{#if $modalStore[0]}
  <div class="{cBase} rounded-xl w-screen h-screen lg:w-[470px] flex flex-col bg-slate-200">
    <div class="grid grid-cols-3 items-center">
      <div>
        {#if (currentPage !== "start")}
          <button
            on:click={() => {currentPage = "start"}}
            class="text-black px-4 py-2 rounded-full"
          >
            <ArrowLeft />
          </button>
        {/if}
      </div>
      <h1 class="text-center text-3xl p-3">Booking</h1>
      <button
        on:click={() => onExitHandler()}
        class="text-black px-4 py-2 rounded-full flex justify-end"
      >
        <X />
      </button>
    </div>

    <div class="h-full flex items-center justify-center text-primary-500">
      <div class="grid grid-cols-3 grid-rows-6 gap-7">
        {#if (currentPage === "start")}
          <div class="{iconContainerClasses}">
            <div class="rounded-3xl m-3 mx-5">
              <Calendar />
            </div>
          </div>
          <div class="{textClasses}">
            {date.toLocaleDateString('de-DE')}
          </div>
          <div class="{iconContainerClasses}">
            <div class="rounded-3xl m-3 mx-5">
              <Clock />
            </div>
          </div>
          <div class="{textClasses}">
            {#if ($interval.morning && $interval.afternoon)}
              <div>07:00-20:00</div>
            {:else if ($interval.morning)}
              <div>07:00-12:00</div>
            {:else}
              <div>13:00-20:00</div>
            {/if}
          </div>
          <div class="{iconContainerClasses}">
            <div class="rounded-3xl m-3 mx-5">
              <MapPin />
            </div>
          </div>
          <div class="{textClasses}">
            {$user.location?.locationname}
          </div>
          <div class="{iconContainerClasses}">
            <div class="rounded-3xl m-3 mx-5">
              <Building />
            </div>
          </div>
          <div class="{textClasses}">
            {$selectedDesks[0].floor.building.buildingname}
          </div>
          <div class="{iconContainerClasses}">
            <div class="rounded-3xl m-3 mx-5">
              <Cuboid />
            </div>
          </div>
          <div class="{textClasses}">
            {$selectedDesks[0].floor.floorname}
          </div>
          <div class="{iconContainerClasses}">
            <div class="rounded-3xl m-3 mx-5">
              <Armchair />
            </div>
          </div>
          <button class="col-span-2 rounded-3xl flex justify-center items-center text-xl variant-filled-primary"
                  on:click={() => {currentPage = "desks"}}
          >
            Show Desks
          </button>
          <div class="{iconContainerClasses}">
            <div class="rounded-3xl m-3 mx-5">
              <User />
            </div>
          </div>
          <button class="col-span-2 rounded-3xl flex justify-center items-center text-xl variant-filled-primary"
                  on:click={() => {currentPage = "users"}}
          >
            Show Users
          </button>
        {:else if (currentPage === "desks")}
          {#each $selectedDesks as desk}
            <div class="{iconContainerClasses}">
              <div class="rounded-3xl m-3 mx-5">
                <Armchair />
              </div>
            </div>
            <div class="{textClasses}">
              {desk.desknum}
            </div>
          {/each}
        {:else if (currentPage === "users")}
          {#each $selectedUsers as user}
            <div class="{iconContainerClasses}">
              <div class="rounded-3xl m-3 mx-5">
                <User />
              </div>
            </div>
            <div class="{textClasses}">
              {user.username}
            </div>
          {/each}
        {/if}
      </div>
    </div>

    <div class="bg-white h-24 rounded-full">
      <button on:click={() => finishBooking()}
              class="btn rounded-full w-full h-full text-xl variant-filled-primary"
      >Book
      </button
      >
    </div>
  </div>
{/if}
