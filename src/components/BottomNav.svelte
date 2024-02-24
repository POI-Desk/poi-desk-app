<script>
  import { List, Map, User } from "lucide-svelte";
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";
  import { goto } from "$app/navigation";
  import { isExtended } from "$lib/stores/extendedUserStore";

  $: if (page !== "") goto(page);

  let page = "";
</script>

<!-- TODO still some problems when switching pages -->
<div
  class="w-full z-[100] translate-x-0
    bg-primary-50-900-token text-lg text-primary-500-400-token border-t-[3px] border-primary-500 shadow-around-10 py-2">
  <RadioGroup
    display="grid"
    border="none"
    padding="px-5 py-1"
    active="variant-filled-primary"
    hover="hover:variant-soft-primary"
    background="none"
  >
    <div class="grid grid-cols-3 w-full">
      <div class="flex flex-col justify-center items-center">
        <!-- TODO CHANGE -->
        <RadioItem bind:group={page}
                   name="page"
                   value={"/user"}
                   class="flex flex-col items-center justify-center">
          <User strokeWidth="2.5" size="30" />
        </RadioItem>

        <button on:click={() => page = "/profile"} class="select-none font-semibold">
          Profiles
        </button>
      </div>
      <div class="flex flex-col justify-center items-center">
        <RadioItem bind:group={page}
                   name="page"
                   value={$isExtended ? "/extendedUser" : "/"}
                   class="flex flex-col items-center justify-center">
          <Map strokeWidth="2" size="30" />
        </RadioItem>

        <button on:click={() => page = "/"} class="select-none font-semibold">
          Map
        </button>
      </div>

      <div class="flex flex-col justify-center items-center">
        <RadioItem bind:group={page}
                   name="page"
                   value={"/bookings"}
                   class="flex flex-col items-center justify-center p-0">
          <List strokeWidth="2.5" size="30" />
        </RadioItem>

        <button on:click={() => page = "/bookings"} class="select-none font-semibold">
          Bookings
        </button>
      </div>
    </div>
  </RadioGroup>
</div>
