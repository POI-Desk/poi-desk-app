<script>
  import { Menu } from "lucide-svelte";
  import { quintOut } from "svelte/easing";
  import { slide } from "svelte/transition";

  let showMenu = false;
  const btn = "btn variant-filled-primary shadow-md"
</script>

<div class="absolute bottom-5 variant-filled-primary z-[100] flex flex-col gap-5 p-5 rounded-3xl variant-glass">
  {#if showMenu}
    <div class="flex flex-col gap-5" transition:slide={{ duration: 300, easing: quintOut, axis: 'y' }}>
      <slot />
    </div>
  {/if}

  <button
    class="{btn} w-min"
    on:click={() => showMenu = !showMenu}
  >
    <Menu />
  </button>
</div>