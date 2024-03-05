<script lang="ts">
    import { elasticOut } from 'svelte/easing';
    import { fade } from 'svelte/transition';

    export let duration = 5000;

    function easeAnim(node: HTMLElement, {duration}: { duration: number }) {
        return {
            duration,
            css: (t: number) => {
                const eased = elasticOut(t);
                return `font-size: ${eased * 10}rem;`;
            }
        };
    }
</script>

<div class="fixed top-0 h-screen w-screen z-10 opacity-60" transition:fade>
    <div
            in:easeAnim="{{ duration }}"
            class="h-full w-full text-[24rem] flex justify-center items-center"
    >
        <slot/>
    </div>
</div>