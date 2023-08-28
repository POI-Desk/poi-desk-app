<script lang="ts">
	import Check from '$components/Check.svelte';
	import CrazyAnimation from '$components/CrazyAnimation.svelte';
	import DateSelection from '$components/DateSelection.svelte';
	import {user} from '$lib/userStore';
	import {location} from '$lib/locationStore';

	let visible = false;
	let triggerEl: any;
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

<!--<button class="btn btn-primary" on:click={spinnnnn}>bingbong</button>-->

{#if visible}
	<CrazyAnimation>
		<Check />
	</CrazyAnimation>
{/if}


<a class="btn btn-primary" href="./login">Login</a>

<a class="btn btn-primary" href="./location">Location</a>

<p>{$user?.pk_userId ?? 'no id'}</p>
<p>{$user?.username ?? 'no username'}</p>
<p>{$location?.locationname ?? 'no location'}</p>
<p>{$location?.pk_locationid ?? 'no location'}</p>

<DateSelection />
