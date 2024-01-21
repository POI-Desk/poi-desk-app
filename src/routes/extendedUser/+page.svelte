<script lang="ts">
  import SearchBar from "$components/SearchBar.svelte";
  import { user } from "$lib/userStore";
  import DateSelection from "$components/DateSelection.svelte";
  import BuildingSelection from "$components/BuildingSelection.svelte";
  import IntervalSelection from "$components/ExtendedBookingComponents/IntervalSelection.svelte";
  import FloorSelection from "$components/FloorSelection.svelte";
  import FloorMap from "$components/MapComponents/FloorMap.svelte";
  import { isExtended, selectedDesks, selectedUsers } from "$lib/stores/extendedUserStore";
  import { interval } from "$lib/bookingStore";
  import { getModalStore, type ModalSettings } from "@skeletonlabs/skeleton";
  import { dateValue } from "$lib/dateStore";

  $isExtended = true;

  // --- test data
  // todo change
  $selectedUsers = [{
    pk_userid: "c31ff41b-9f3b-4c47-8ce2-8deaab290ae3",
    username: "Alina",
    location: {
      pk_locationid: "",
      locationname: ""
    },
    userInfo: ""
  }, {
    pk_userid: "c7294b3a-d2a5-4f96-a187-aba2d1e7e66d",
    username: "Markus",
    location: {
      pk_locationid: "",
      locationname: ""
    },
    userInfo: ""
  }, {
    pk_userid: "c4ceb1ed-8fdb-4035-ab0d-5d38c2009d73",
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

  <div
    class="absolute h-11 bottom-24 left-1/2 z-[100] -translate-x-1/2"
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
</div>
