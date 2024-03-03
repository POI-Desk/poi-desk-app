<script>
  import { List, Map, User } from "lucide-svelte";
  import { RadioGroup, RadioItem } from "@skeletonlabs/skeleton";
  import { goto } from "$app/navigation";
  import { isExtended } from "$lib/stores/extendedUserStore";
  import { curPage } from "$lib/pageStore";
</script>

<!-- TODO still some problems when switching pages -->
<div
  class="w-full z-[100] translate-x-0
    bg-primary-50-900-token dark:bg-surface-800 text-lg text-primary-500-400-token border-t-[3px] border-primary-500 shadow-around-10 py-2">
  <RadioGroup
    display="grid"
    border="none"
    padding="px-5 py-1"
    active="variant-filled-primary"
    hover="hover:variant-soft-primary"
    background="none"
  >
    <div class="grid grid-cols-3 w-full">
      <button on:click={() => {
        $curPage = "/user"
        goto($curPage);
      }} class="flex flex-col justify-center items-center font-semibold">
        <RadioItem bind:group={$curPage}
                   name="page"
                   value={"/user"}
                   class="flex flex-col items-center justify-center"
                   on:change={() => goto($curPage)}
        >
          <User strokeWidth="2.5" size="30" />
        </RadioItem>
        Profiles
      </button>

      <button on:click={() => {
        $curPage = $isExtended ? "/extendedUser" : "/";
        goto($curPage);
      }} class="flex flex-col justify-center items-center font-semibold">
        <RadioItem bind:group={$curPage}
                   name="page"
                   value={$isExtended ? "/extendedUser" : "/"}
                   class="flex flex-col items-center justify-center"
                   on:change={() => goto($curPage)}
        >
          <Map strokeWidth="2" size="30" />
        </RadioItem>
        Map
      </button>

      <button on:click={() => {
        $curPage = "/bookings"
        goto($curPage);
      }} class="flex flex-col justify-center items-center font-semibold">
        <RadioItem bind:group={$curPage}
                   name="page"
                   value={"/bookings"}
                   class="flex flex-col items-center justify-center p-0"
                   on:change={() => goto($curPage)}
        >
          <List strokeWidth="2.5" size="30" />
        </RadioItem>
        Bookings
      </button>
    </div>
  </RadioGroup>
</div>
