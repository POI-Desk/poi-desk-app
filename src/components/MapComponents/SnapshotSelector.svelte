<script lang="ts">
	import { goto, invalidateAll } from '$app/navigation';
	import { page } from '$app/stores';
	import { graphql } from '$houdini';
	import { Button } from '$lib/components/ui/button';
	import { defaultMapProps } from '$lib/map/props';
	import { deleteMap } from '$lib/mutations/map';
	import type { Location } from '$lib/types/locationType';
	import {
		ListBox,
		ListBoxItem,
		getModalStore,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import {
		AlignHorizontalDistributeCenter,
		Building2,
		ChevronRight,
		ChevronsRight,
		Trash2
	} from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';
	import { toast } from 'svelte-sonner';

	const dispatch = createEventDispatcher();
	const modalStore = getModalStore();

	const namePromptModal: ModalSettings = {
		type: 'prompt',
		// Data
		title: 'Enter Name',
		body: 'Provide a name for the map',
		// Populates the input value and attributes
		value: '',
		valueAttr: { type: 'text', minlength: 1, maxlength: 10, required: true },
		// Returns the updated response value
		response: (r: string) => {
			if (!r) return;

			const id: string = buildingsAndFloors![buildingGroup].floors![floorGroup].pk_floorid;
			if (!id) return;
			createNewSnapshot(id, r);
		}
	};

	export let snapshotsOfFloor: any;
	export let buildingsAndFloors: any;
	export let location: Location | null;

	let buildingGroup = buildingsAndFloors.findIndex(
		(b: any) => b.buildingname === $page.url.searchParams.get('building')
	);
	let floorGroup = buildingsAndFloors[buildingGroup].floors.findIndex(
		(f: any) => f.floorname === $page.url.searchParams.get('floor')
	);
	let formattedDate = '00-00-0000';

	const createSnapshot = graphql(`
		mutation createSnapshot($floorId: ID!, $name: String!, $fallback: MapInput) {
			createMapSnapshotOfFloor(floorId: $floorId, name: $name, fallback: $fallback) {
				pk_mapId
			}
		}
	`);

	const deleteSnapshot = async (mapid: string) => {
		await deleteMap.mutate({ mapId: mapid });
		invalidateAll(); // TODO: Invalidate only the map query
	};

	const snapshotSelected = (mapId: string) => {
		dispatch('select', mapId);
	};

	const createNewSnapshot = async (floorId: string, name: string) => {
		if (!floorId) {
			toast.error('Map could not be created!', {
				position: 'bottom-center'
			});
			return;
		}

		const newMap = await createSnapshot.mutate({
			floorId: floorId,
			name: name,
			fallback: {
				height: defaultMapProps.height,
				width: defaultMapProps.width,
				name: name
			}
		});

		if (!newMap.data?.createMapSnapshotOfFloor?.pk_mapId) {
			toast.error('Map could not be created!', {
				position: 'bottom-center'
			});
			return;
		}

		dispatch('create', newMap.data?.createMapSnapshotOfFloor?.pk_mapId);
	};

	const newButtonClicked = () => {
		if (!buildingsAndFloors) return;

		modalStore.trigger(namePromptModal);
	};

	const buildingChange = (buildingName: string) => {
		floorGroup = 0;
		goto(
			`?building=${buildingName}&floor=${buildingsAndFloors[buildingGroup].floors![0].floorname}`
		);
	};

	const floorChange = (floorName: string) => {
		goto(`?building=${buildingsAndFloors[buildingGroup].buildingname}&floor=${floorName}`);
	};

	const headStyle: string =
		'flex flex-row pl-2 mb-1 text-surface-900 text-lg py-1 border-b-[1px] border-surface-900';

	const cardStyle: string = 'w-48 h-48';
</script>

<div
	class="absolute p-5 flex z-[900] w-2/3 max-w-screen-lg left-1/2 top-[20%] -translate-x-1/2 bg-surface-50 rounded-lg shadow-2xl"
>
	<div class="border-r-[1px] border-surface-900 -m-5 mr-5 flex flex-col p-4 gap-1 max-w-[17rem]">
		<p class="flex align-top justify-center mb-2 text-3xl text-primary-500">
			{location?.locationname}
		</p>
		<div class={headStyle}>
			<Building2 class="text-surface-400 mr-2" />
			Buildings
		</div>
		<!-- maby -mr-2 -->
		<div class="max-h-56 overflow-x-hidden">
			<ListBox>
				{#each buildingsAndFloors ?? [] as building, i (i)}
					<ListBoxItem
						on:change={() => buildingChange(building.buildingname)}
						class="py-2 pr-48 pl-4"
						bind:group={buildingGroup}
						name="medium"
						value={i}
					>
						<div class="flex flex-row">
							<ChevronsRight class="mr-2 w-[22px]" />
							{building.buildingname}
						</div>
					</ListBoxItem>
				{/each}
			</ListBox>
		</div>
		<div class="{headStyle} mt-4">
			<AlignHorizontalDistributeCenter class="mr-2 text-surface-400" />
			Floors
		</div>
		<!-- maby -mr-2 -->
		<div class="max-h-56 overflow-x-hidden">
			<ListBox>
				{#if buildingsAndFloors != null}
					{#each buildingsAndFloors[buildingGroup].floors ?? [] as floor, i (i)}
						<ListBoxItem
							class="py-2 pr-48 pl-4"
							bind:group={floorGroup}
							name="medium"
							value={i}
							on:change={() => {
								floorChange(floor.floorname);
							}}
						>
							<div class="flex flex-row">
								<!-- <MoveRight class="mr-2 w-[22px]" /> -->
								<ChevronRight class="mr-2 w-[22px]" />
								{floor.floorname}
							</div>
						</ListBoxItem>
					{/each}
				{/if}
			</ListBox>
		</div>
		<!-- <Button class="hover:bg-primary-400 hover:bg-opacity-20 hover:text-primary-800 text-primary-500 hover:font-bold py-2 pr-52 pl-4 rounded-lg max-w-[14rem]">Buildings</Button>
        <Button class="hover:bg-primary-400 hover:bg-opacity-20 hover:text-primary-800 text-primary-500 hover:font-bold py-2 pr-52 pl-4 rounded-lg max-w-[14rem]">Floors</Button> -->
	</div>
	<div class="flex flex-wrap gap-3 w-full max-h-[38rem] overflow-x-hidden p-1">
		{#if snapshotsOfFloor}
			{#each snapshotsOfFloor.sort((a, b) => new Date(b.updatedOn).valueOf() - new Date(a.updatedOn).valueOf()) ?? [] as snapshot}
				<div
					tabindex="0"
					role="button"
					on:click={() => snapshotSelected(snapshot.pk_mapId)}
					on:keydown={() => {}}
					on:keyup={() => {}}
					class="flex flex-col card card-hover select-none variant-ghost-secondary {cardStyle}"
				>
					<div class="flex justify-end w-full">
						<button
							class="p-1 m-1 rounded-lg bg-error-300"
							on:click|stopPropagation={() => deleteSnapshot(snapshot.pk_mapId)}
						>
							<Trash2 class="text-error-500 rounded-full" />
						</button>
					</div>
					<div class="flex justify-center items-center text-2xl h-full text-primary-500 font-bold">
						{snapshot.name}
					</div>
					<div class="text-primary-500 border-t-[1px] border-tertiary-700">
						<p class="p-2 text-center">
							{snapshot.updatedOn.split('T')[0] !== formattedDate
								? snapshot.updatedOn.split('T')[0]
								: snapshot.updatedOn.split('T')[1].split(':')[0] +
								  ':' +
								  snapshot.updatedOn.split('T')[1].split(':')[1]}
						</p>
					</div>
				</div>
			{/each}
		{/if}

		<Button
			class="card card-hover select-none text-2xl text-primary-500 font-bold variant-ghost-secondary {cardStyle}"
			on:click={newButtonClicked}
		>
			+
		</Button>
	</div>
</div>
