<script lang="ts">
	import BingBong from '$components/BingBong.svelte';
	import Check from '$components/Check.svelte';
	import CrazyAnimation from '$components/CrazyAnimation.svelte';

	let visible = false;

	function spinnnnn() {
		visible = true;
		setTimeout(() => {
			visible = false;
		}, 5000);
	}
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
<button class="btn btn-primary" on:click={spinnnnn}>bingbong</button>

{#if visible}
	<CrazyAnimation>
		<Check />
	</CrazyAnimation>
{/if}
