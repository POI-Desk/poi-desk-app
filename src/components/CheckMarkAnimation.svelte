<script lang="ts">
  import { quadOut } from "svelte/easing";
  import { scale } from "svelte/transition";

  export let duration = 1000;

  function easeAnim(node: HTMLElement, { duration }: { duration: number }) {
    return {
      duration,
      css: (t: number) => {
        const eased = quadOut(t);
        return `opacity: ${eased * 10 + 80}%;`;
      }
    };
  }
</script>

<div class="fixed top-0 h-screen w-screen z-10" transition:scale={{ duration, start: 0.5, easing: quadOut }}>>
  <div
    in:easeAnim="{{ duration }}"
    class="h-full w-full text-[24rem] flex justify-center items-center"
  >
    <slot />
  </div>
</div>
