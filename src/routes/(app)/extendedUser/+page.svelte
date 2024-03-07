<script lang="ts">
  import SearchBar from "$components/SearchBar.svelte";
  import DateSelection from "$components/DateSelection.svelte";
  import BuildingSelection from "$components/BuildingSelection.svelte";
  import IntervalSelection from "$components/ExtendedBookingComponents/IntervalSelection.svelte";
  import FloorSelection from "$components/FloorSelection.svelte";
  import FloorMap from "$components/MapComponents/FloorMap.svelte";
  import { isExtended, selectedDesks, selectedUsers } from "$lib/stores/extendedUserStore";
  import { interval } from "$lib/stores/bookingStore";
  import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
  import { dateValue } from "$lib/stores/dateStore";
  import { fade } from "svelte/transition";
  import ExtendedUserSelection from "$components/ExtendedBookingComponents/ExtendedUserSelection.svelte";


  $isExtended = true;

  $selectedUsers = []

  const modalStore = getModalStore();

  const modal: ModalSettings = {
    type: "component",
    component: "modalExtendedBooking",
    response: () => {
      $dateValue = new Date().toISOString().split("T")[0];
    }
  };
</script>

{#if ($selectedUsers.length === 0)}
  <ExtendedUserSelection />
{:else }
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

    <div class="absolute bottom-44 left-1/2 z-[100] -translate-x-1/2">
      <div class="in:fade flex justify-center">
        {#if ($selectedUsers.length === $selectedDesks.length && ($interval.morning || $interval.afternoon))}
          <button in:fade on:click={() => {
                if ($selectedUsers.length === $selectedDesks.length && ($interval.morning || $interval.afternoon)) {
                    modalStore.trigger(modal);
                }
            }}
                  class="btn px-7 variant-filled-primary"
                  disabled="{$selectedDesks.length !== $selectedUsers.length || !($interval.morning || $interval.afternoon)}"
          >Book
          </button>
        {:else}
          <div in:fade class="py-1 px-3 rounded-full variant-filled-secondary"
          >{$selectedDesks.length}/{$selectedUsers.length} Selected
          </div>
        {/if}
      </div>
    </div>
  </div>
{/if}
