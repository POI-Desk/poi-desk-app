<script lang="ts">
	import { onMount } from 'svelte';
	import { elasticOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	export let duration = 5000;

	function crazySpin(node: HTMLElement, { duration }: { duration: number }) {
		return {
			duration,
			css: (t: number) => {
				const eased = elasticOut(t);
				return `
					transform: rotate(${eased * 1080}deg);
					font-size: ${eased * 24}rem;
				`;
			}
		};
	}
</script>

<div class="fixed top-0 h-screen w-screen z-10 opacity-60 fireworks" transition:fade>
	<div
		in:crazySpin={{ duration }}
		class="h-full w-full text-[24rem] flex justify-center items-center"
	>
		<slot />
	</div>
</div>

<style>
	.fireworks {
		background-image: url('/fireworks.gif');
		background-size: cover;
		background-position: center;
	}
</style>
