<script lang="ts">
	import { goto } from '$app/navigation';
	import SnapshotSelector from '$components/MapComponents/SnapshotSelector.svelte';

	const changeMap = async (mapId: string) => {
		goto(`/admin/maps/${mapId}`);
	};
</script>

<div class="w-screen h-1/3 bg-surface-400">
	<button class="btn variant-filled-primary mt-5 ml-5" on:click={() => goto('/')}>Back</button>
</div>

<SnapshotSelector
	on:select={(event) => changeMap(event.detail)}
	on:create={(event) => changeMap(event.detail)}
/>
