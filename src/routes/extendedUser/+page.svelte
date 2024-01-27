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
