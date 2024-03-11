<script lang="ts">
	import { goto } from '$app/navigation';
	import SnapshotSelector from '$components/MapComponents/SnapshotSelector.svelte';
	import type { User } from '$lib/types/userTypes';
	import type { PageData } from './$types';

	export let data: PageData;

	$: ({ snapShots } = data);

	$: session = data.session! as User;

	const changeMap = async (mapId: string) => {
		goto(`/admin/maps/${mapId}`);
	};
</script>

<div class="absolute flex justify-center items-center w-full p-8">
	<div
		class="w-2/3 ml-4 max-w-screen-lg flex justify-between p-2 bg-surface-50 rounded-full shadow-around-10"
	>
		<button class="btn variant-filled-primary" on:click={() => goto('/user')}>User</button>
		<button class="btn variant-filled-primary" on:click={() => goto('/')}>Home</button>
		<button class="btn variant-filled-primary" on:click={() => goto('/admin/analysis')}
			>Analytics</button
		>
	</div>
</div>

<SnapshotSelector
	buildingsAndFloors={data.buildings}
	snapshotsOfFloor={$snapShots.data?.getMapSnapshotsByLocationBuildingFloorName}
	location={session.location}
	on:select={(event) => changeMap(event.detail)}
	on:create={(event) => changeMap(event.detail)}
/>
