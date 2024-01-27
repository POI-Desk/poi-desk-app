<script lang="ts">
  import SearchBar from "$components/SearchBar.svelte";
  import DateSelection from "$components/DateSelection.svelte";
  import BuildingSelection from "$components/BuildingSelection.svelte";
  import IntervalSelection from "$components/ExtendedBookingComponents/IntervalSelection.svelte";
  import FloorSelection from "$components/FloorSelection.svelte";
  import FloorMap from "$components/MapComponents/FloorMap.svelte";
  import { isExtended, selectedDesks, selectedUsers } from "$lib/stores/extendedUserStore";
  import { interval } from "$lib/bookingStore";
  import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
  import { dateValue } from "$lib/dateStore";
  import { fade } from "svelte/transition";


  $isExtended = true;


  // --- test data
  // todo change
  $selectedUsers = [{
    pk_userid: "fef81e89-fda4-4136-befd-797bb64f3ffb",
    username: "Alina",
    location: {
      pk_locationid: "",
      locationname: ""
    },
    userInfo: ""
  }, {
    pk_userid: "2fdcb187-60f7-4dda-82ab-b7bb2c23820a",
    username: "Markus",
    location: {
      pk_locationid: "",
      locationname: ""
    },
    userInfo: ""
  }, {
    pk_userid: "37f60f13-f4b5-4518-b9aa-4d5a8a0a3434",
    username: "Jupp",
    location: {
      pk_locationid: "",
      locationname: ""
    },
    userInfo: ""
  }];
  // -----

  const modalStore = getModalStore();

  const modal: ModalSettings = {
    type: "component",
    component: "modalExtendedBooking",
    response: () => {
      $dateValue = new Date().toISOString().split("T")[0];
    }
  };
</script>
<div class="overflow-hidden h-screen">
    <FloorMap />

    <div class="absolute p-8" style="width: 100%">
      <SearchBar />

      <div class="flex justify-center p-1">
        <DateSelection />
      </div>
      <div class="flex justify-center p-1">
        <IntervalSelection />
      </div>

    </div>

    <FloorSelection />

    <BuildingSelection />

    <div class="absolute bottom-24 left-1/2 z-[100] -translate-x-1/2">
      <div class="in:fade flex justify-center">
        {#if ($selectedUsers.length === $selectedDesks.length && ($interval.morning || $interval.afternoon))}
          <button in:fade on:click={() => {
                if ($selectedUsers.length === $selectedDesks.length && ($interval.morning || $interval.afternoon)) {
                    modalStore.trigger(modal);
                }
            }}
                  class="btn pl-7 pr-7 variant-filled-primary"
                  disabled="{$selectedDesks.length !== $selectedUsers.length || !($interval.morning || $interval.afternoon)}"
          >Book
          </button>
        {:else}
          <div in:fade class="p-1 pl-3 pr-3 rounded-full variant-filled-secondary">{$selectedDesks.length}
            /{$selectedUsers.length}
            Selected
          </div>
        {/if}
      </div>
    </div>
</div>

