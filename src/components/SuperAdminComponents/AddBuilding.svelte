<script lang="ts">
	//import { addBuilding } from "$lib/mutations/buildings";
	import { getBuildings } from '$lib/queries/buildingQueries';
	import { onMount } from 'svelte';
	import AddFloor from "$components/SuperAdminComponents/AddFloor.svelte";
	import { locationid } from '$lib/locationStore';
	import { showAddLocation } from '$lib/locationStore';
	import { isSaveDisabled, newBuildings, editBuildingclicked } from '$lib/superAdminStore';
	import BuildingInput from './BuildingInput.svelte';
	import {v4 as uuidv4} from 'uuid';

	$: locid = $locationid;

	

	let buildingNames: String[] = [];
	let showAddBuilding: boolean = false;
	let newName: String = '';
	let editedBuildingId: uuidv4;
	$newBuildings = [];
	$editBuildingclicked = false;


	onMount(async () => {
		await getBuildings.fetch({ variables: { locationid: locid } });
		let buildings = $getBuildings.data?.getBuildingsInLocation;
		for (let building in buildings) {
			buildingNames.push(building.buildingname);
		}
	});

	function handleAddBuilding() {
		showAddBuilding = true;
		const newId = uuidv4();
		$newBuildings.push({ id: newId, name: '' });
		$newBuildings = $newBuildings;
	}

	function updateNewNames(id: uuidv4, newName: string) {
		$newBuildings = $newBuildings.map((field) =>
			field.id === id ? { ...field, name: newName } : field
		);
	}

	function removeBuildingInput(id: uuidv4, name: string) {
		//const index = newBuildings.indexOf({ id, name });
		const index = $newBuildings.findIndex((b) => b.id === id)
		console.log(id + " " + name);
		
		
		$newBuildings.splice(index, 1);
		$newBuildings = $newBuildings;
	}
</script>

<div>
	{#if $showAddLocation}
		<h1>Buildings</h1>
		{#if showAddBuilding}
			{#each $newBuildings as { id, name }}
				<div class="input">
					<BuildingInput {id} {name} onInput={(newId, newName) => updateNewNames(newId, newName)} />
					<button on:click={() => removeBuildingInput(id, name)}>x</button>
					{id + "" + name}
					<button on:click={() => {
						editedBuildingId = id;
						$editBuildingclicked = true;
						}}>edit</button>
				</div>
			{/each}
			{#if $editBuildingclicked}
				<AddFloor buildingId={editedBuildingId}/>
			{/if}
		{/if}

		<div>
			<button class="btn variant-filled-primary" on:click={handleAddBuilding}>Add Building</button>
			
		</div>
	{/if}
</div>
