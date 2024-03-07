<script lang="ts">
	import { goto } from "$app/navigation";
	import SnapshotSelector from "$components/MapComponents/SnapshotSelector.svelte";

	const changeMap = async (mapId: string) => {
		goto(`/admin/maps/${mapId}`);
	};
</script>

<SnapshotSelector
	on:select={(event) => changeMap(event.detail)}
	on:create={(event) => changeMap(event.detail)}
/>

