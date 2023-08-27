<script lang="ts">
	import Check from '$components/Check.svelte';
	import CrazyAnimation from '$components/CrazyAnimation.svelte';
	import DateSelection from '$components/DateSelection.svelte';
	import type { PageData } from './$types';
	import SeatsOnFloor from '$components/SeatsOnFloor.svelte';

	let visible = false;
	let panelVisible = false;

	function togglePanel() {
		panelVisible = !panelVisible;
	}

	function hidePanel() {
		panelVisible = false;
	}

	function spinnnnn() {
		visible = true;
		setTimeout(() => {
			visible = false;
		}, 5000);
	}
</script>

<button class="btn btn-primary" on:click={spinnnnn}>bingbong</button>

{#if visible}
	<CrazyAnimation>
		<Check />
	</CrazyAnimation>
{/if}

<DateSelection />

<a class="btn btn-primary" href="./location">Location</a>
