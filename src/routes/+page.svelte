<script lang="ts">
	import Check from '$components/Check.svelte';
	import CrazyAnimation from '$components/CrazyAnimation.svelte';
	// import type { PageData } from './$types';
	import type { PageData } from './$houdini';

	let visible = false;

	function spinnnnn() {
		visible = true;
		setTimeout(() => {
			visible = false;
		}, 5000);
	}

	export let data: PageData;
	$: ({ getUsers } = data);
	$: users = $getUsers.data?.getAllUsers;
</script>

{#if users}
	<ul>
		{#each users as user (user?.pk_userid)}
			<li>{user?.username}</li>
		{/each}
	</ul>
{/if}

<button class="btn btn-primary" on:click={spinnnnn}>bingbong</button>

{#if visible}
	<CrazyAnimation>
		<Check />
	</CrazyAnimation>
{/if}
