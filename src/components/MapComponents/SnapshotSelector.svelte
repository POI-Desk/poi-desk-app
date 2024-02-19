<script lang="ts">
	import { CachePolicy, graphql } from '$houdini';
	import { user } from '$lib/userStore';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	import { createEventDispatcher, onMount } from 'svelte';

	const dispatch = createEventDispatcher();

	let buildingGroup = 0;
	let floorGroup = 0;

	$: currentUser = $user;

	const snapshots = graphql(`
		query getMapSnapshotsOfFloor($floorId: ID!) {
			getMapSnapshotsOfFloor(floorId: $floorId) {
				pk_mapId
			}
		}
	`);

	export const _getBuildingsAndFloorsInLocationVariables = () => {
		return { locationId: $user.location?.pk_locationid };
	};

	const buildings = graphql(`
		query getBuildingsAndFloorsInLocation($locationId: ID!) @load {
			getBuildingsInLocation(locationid: $locationId) {
				pk_buildingid
				buildingname
				floors {
					pk_floorid
					floorname
				}
			}
		}
	`);

	$: snapshotsOfFloor = $snapshots.data?.getMapSnapshotsOfFloor;
	$: buildingsAndFloors = $buildings.data?.getBuildingsInLocation;

	// INFO: 🤮🤮🤮🤮🤮🤮🤮🤮
	$: if (buildingsAndFloors) {
		if (buildingsAndFloors[buildingGroup]) {
			if (buildingsAndFloors[buildingGroup].floors) {
				if (buildingsAndFloors[buildingGroup].floors![floorGroup]) {
					console.log('FETCH BRO');
					fetchSnapshots(buildingsAndFloors[buildingGroup].floors![floorGroup].pk_floorid);
				}
			}
		}
	}

	const fetchSnapshots = async (floorId: string) => {
		return await snapshots.fetch({
			variables: { floorId: floorId },
			policy: CachePolicy.NetworkOnly
		});
	};

	const snapshotSelected = (mapId: string) => {
		dispatch('select', mapId);
	};
</script>

<div
	class="absolute p-5 flex z-[999] w-2/3 max-w-screen-xl left-1/2 top-[20%] -translate-x-1/2 bg-surface-50 rounded-lg shadow-2xl"
>
	<div class="border-r-[1px] border-primary-400 -m-5 mr-5 flex flex-col p-2 gap-1">
		<p class="flex align-top justify-center text-2xl text-primary-500">
			{currentUser.location?.locationname}
		</p>
		<ListBox>
			{#each buildingsAndFloors ?? [] as building, i (i)}
				<ListBoxItem
					on:change={() => (floorGroup = 0)}
					class="py-2 pr-52 pl-4 rounded-lg max-w-[14rem]"
					bind:group={buildingGroup}
					name="medium"
					value={i}>{building.buildingname}</ListBoxItem
				>
			{/each}
		</ListBox>
		<ListBox>
			{#if buildingsAndFloors != null}
				{#each buildingsAndFloors[buildingGroup].floors ?? [] as floor, i (i)}
					<ListBoxItem
						class="py-2 pr-52 pl-4 rounded-lg max-w-[14rem]"
						bind:group={floorGroup}
						name="medium"
						value={i}>{floor.floorname}</ListBoxItem
					>
				{/each}
			{/if}
		</ListBox>
		<!-- <button class="hover:bg-primary-400 hover:bg-opacity-20 hover:text-primary-800 text-primary-500 hover:font-bold py-2 pr-52 pl-4 rounded-lg max-w-[14rem]">Buildings</button>
        <button class="hover:bg-primary-400 hover:bg-opacity-20 hover:text-primary-800 text-primary-500 hover:font-bold py-2 pr-52 pl-4 rounded-lg max-w-[14rem]">Floors</button> -->
	</div>
	<div class="flex flex-wrap gap-2 w-full">
		{#if snapshotsOfFloor}
			{#each snapshotsOfFloor ?? [] as snapshot}
				<button
					on:click={() => snapshotSelected(snapshot.pk_mapId)}
					class="card card-hover select-none text-2xl text-primary-500 font-bold variant-ghost-secondary p-24"
				>
					{snapshot.pk_mapId}
				</button>
			{/each}
		{/if}

		<button
			class="card card-hover select-none text-2xl text-primary-500 font-bold variant-ghost-secondary p-24"
		>
			+
		</button>
	</div>
</div>
