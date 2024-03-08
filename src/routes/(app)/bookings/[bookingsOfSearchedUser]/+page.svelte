<script>
  import { goto } from "$app/navigation";

  import BookingsOfSearchedUser from "$components/BookingsOfSearchedUser.svelte";
  import { searchedUser } from "$lib/stores/searchStore";
  import { X } from "lucide-svelte";
</script>

<div class="flex flex-col items-center justify-center">
  <div class="w-full bg-tertiary-50-900-token p-5 px-20 shadow-md">
    <div class="grid grid-cols-3">
      <div></div>
      <div class="flex-1 flex items-center justify-center mb-3" style="color: #1A4775;">
        <h1 class="text-2xl">{$searchedUser.username}</h1>
      </div>

      <button
        on:click={() => {
          goto('/');
        }}
        class="text-black px-0 rounded-full justify-self-end"
      >
        <X size="35" />
      </button>
    </div>
  </div>


  <div class="flex flex-col items-center justify-center">
    <div class="flex flex-row w-full justify-center p-5">
      <BookingsOfSearchedUser />
    </div>
  </div>
</div>