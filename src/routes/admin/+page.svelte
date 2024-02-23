<script lang="ts">
	import { goto } from '$app/navigation';
	import SnapshotSelector from '$components/MapComponents/SnapshotSelector.svelte';
	import { onMount } from 'svelte';

	const changeMap = async (mapId: string) => {
		goto(`/admin/maps/${mapId}`);
	};
</script>

<SnapshotSelector
	on:select={(event) => changeMap(event.detail)}
	on:create={(event) => changeMap(event.detail)}
/>

<div class="absolute flex justify-center items-center w-full p-3">
	<div class="w-full ml-4 max-w-screen-lg flex justify-between border-b-[1px] border-surface-900 py-2">
		<button class="btn variant-filled-primary" on:click={() => goto('/')}>Home</button>
		<button class="btn variant-filled-primary" on:click={() => goto('/admin')}>Admin</button>
		<button class="btn variant-filled-primary" on:click={() => alert('not implemented yet')}>Analytics</button>
	</div>
</div>
