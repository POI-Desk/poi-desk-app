<script lang="ts">
	import { building } from '$app/environment';
	import { goto } from '$app/navigation';
	import SnapshotSelector from '$components/MapComponents/SnapshotSelector.svelte';
	import type { User } from '$lib/types/userTypes';
	import type { PageData } from './$types';
	import { Button } from '$lib/components/ui/button';

	export let data: PageData;

	$: ({ snapshots } = data);

	$: buildingName = data.query?.building ?? '';
	$: floorName = data.query?.floor ?? '';

	$: session = data.session! as User;

	const changeMap = async (mapId: string) => {
		goto(`/admin/maps/${mapId}`);
	};
</script>

<div class="absolute flex justify-center items-center w-full p-8">
	<div
		class="w-2/3 ml-4 max-w-screen-lg flex justify-between p-2 bg-surface-50 rounded-full shadow-around-10"
	>
		<Button class="btn variant-filled-primary" on:click={() => goto('/user')}>User</Button>
		<Button class="btn variant-filled-primary" on:click={() => goto(`/?building=${buildingName}&floor=${floorName}`)}>Home</Button>
		<Button class="btn variant-filled-primary" on:click={() => goto('/admin/analysis')}
			>Analytics</Button
		>
	</div>
</div>

<SnapshotSelector
	{buildingName}
	{floorName}
	buildingsAndFloors={data.buildings}
	snapshotsOfFloor={$snapshots.data?.getMapSnapshotsByLocationBuildingFloorName}
	location={session.location}
	on:select={(event) => changeMap(event.detail)}
	on:create={(event) => changeMap(event.detail)}
/>
