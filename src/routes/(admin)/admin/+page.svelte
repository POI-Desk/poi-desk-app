<script lang="ts">
	import { goto } from "$app/navigation";
	import SnapshotSelector from "$components/MapComponents/SnapshotSelector.svelte";
	import BurgerMenu from "$components/SuperAdminComponents/BurgerMenu.svelte";

	const changeMap = async (mapId: string) => {
		goto(`/admin/maps/${mapId}`);
	};
	const btn = "btn variant-filled-primary shadow-md"
</script>

<SnapshotSelector
	on:select={(event) => changeMap(event.detail)}
	on:create={(event) => changeMap(event.detail)}
/>
<div class="px-5">
	<BurgerMenu>
		<button on:click={() => goto("/")} class="{btn}">Back to POI-Desk</button>
		<button on:click={() => goto("/admin/analysis")} class="{btn}">Analysis</button>
		<button on:click={() => goto("/admin/predictions")} class="{btn}">Prediction</button>
		<button
			class="btn variant-filled-primary z-[100]"
			on:click={() => {
			goto(`/admin`);
		}}
		>
			Change Snapshot
		</button>
	</BurgerMenu>
</div>
