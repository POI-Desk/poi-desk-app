<script lang="ts">
	import { goto } from "$app/navigation";
	import SnapshotSelector from "$components/MapComponents/SnapshotSelector.svelte";

	const changeMap = async (mapId: string) => {
		goto(`/admin/maps/${mapId}`);
	};
</script>

<!-- <div class="absolute flex justify-center items-center w-full p-3">
	<div class="w-full ml-4 max-w-screen-lg flex justify-between p-2 variant-filled-secondary rounded-full shadow-lg">
		<button class="btn variant-filled-primary" on:click={() => goto('/')}>Home</button>
		<button class="btn variant-filled-primary" on:click={() => goto('/admin')}>Admin</button>
		<button class="btn variant-filled-primary" on:click={() => alert('not implemented yet')}>Analytics</button>
	</div>
</div> -->

<SnapshotSelector
	on:select={(event) => changeMap(event.detail)}
	on:create={(event) => changeMap(event.detail)}
/>

