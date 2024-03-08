<script>
  import { Menu } from "lucide-svelte";
  import { quintOut } from "svelte/easing";
  import { slide } from "svelte/transition";
  import { goto } from "$app/navigation";

  let showMenu = false;
  const btn = "btn variant-filled-primary shadow-md"
</script>

<div class="fixed bottom-10 flex flex-col gap-5 p-5 rounded-3xl variant-glass">
  {#if showMenu}
    <div class="flex flex-col gap-5" transition:slide={{ duration: 300, easing: quintOut, axis: 'y' }}>
      <button on:click={() => goto("/")} class="{btn}">Back to POI-Desk</button>
      <button on:click={() => goto("/superadmin/editUser")} class="{btn}">Edit Users</button>
      <button on:click={() => goto("/superadmin")} class="{btn}">Home</button>
    </div>
  {/if}

  <button
    class="{btn} w-min"
    on:click={() => showMenu = !showMenu}
  >
    <Menu />
  </button>
</div>