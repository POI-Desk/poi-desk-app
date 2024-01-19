<script lang="ts">
  import SearchBar from "$components/SearchBar.svelte";
  import { user } from "$lib/userStore.ts";
  import DateSelection from "$components/DateSelection.svelte";
  import BuildingSelection from "$components/BuildingSelection.svelte";
  import IntervalSelection from "$components/ExtendedBookingComponents/IntervalSelection.svelte";
  import FloorSelection from "$components/FloorSelection.svelte";
  import FloorMap from "$components/MapComponents/FloorMap.svelte";
  import { isExtended, selectedDesks, selectedUsers } from "$lib/stores/extendedUserStore";
  import { interval } from "$lib/bookingStore.js";
  import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
  import { dateValue } from "$lib/dateStore.js";

  $isExtended = true;

  // --- test data
  // todo change
  $selectedUsers = [{
    pk_userid: "e0d7d1a6-81cd-4dad-966c-6049140cb8c5",
    username: "Alina",
    location: {
      pk_locationid: "",
      locationname: ""
    },
    userInfo: ""
  }, {
    pk_userid: "73e4d8a5-4a3d-4769-9403-f336297a913d",
    username: "Markus",
    location: {
      pk_locationid: "",
      locationname: ""
    },
    userInfo: ""
  }, {
    pk_userid: "333a39b4-a620-4d14-9864-f2c8858569b0",
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

<div class="m-3">

  <h1>Extended User</h1>

  <a class="btn variant-filled-primary" href="/">Back</a>
  <a class="btn variant-filled-primary" href="/login">Login</a>

  <!--Debugging-->
  <!-- <p>{$user.pk_userid ?? 'no id'}</p> -->
  <p>You are logged in as {$user.username ?? 'no username'}</p>
  <p>Your location is {$user.location?.locationname ?? 'no location'}</p>
  <!-- <p>{$user.location?.pk_locationid ?? 'no location'}</p> -->
  <!---->
  <SearchBar />

  <DateSelection />

  <IntervalSelection />

  <FloorSelection />

  <FloorMap />
  <!--    <EBDeskSelection/>-->

  <BuildingSelection />

  <!--    	Extended Booking Test-->
  <div
    class="absolute h-11 bottom-24 left-1/2 z-[100] -translate-x-1/2 shadow-around-10"
  >
    <button on:click={() => {
                if ($selectedUsers.length === $selectedDesks.length && ($interval.morning || $interval.afternoon)) {
                    modalStore.trigger(modal);
                }
            }}
            class="btn variant-filled-primary"
            disabled="{$selectedDesks.length !== $selectedUsers.length || !($interval.morning || $interval.afternoon)}"
    >Book
    </button>
  </div>
  <!--    -->
</div>
