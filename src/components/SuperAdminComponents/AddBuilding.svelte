<script lang="ts">
	//import { addBuilding } from "$lib/mutations/buildings";
	import { getBuildings } from '$lib/queries/buildingQueries';
	import { onMount } from 'svelte';
	import { locationid } from '$lib/locationStore';
	import { showAddLocation } from '$lib/locationStore';
	import { isSaveDisabled, newBuildingNames } from '$lib/superAdminStore';
	import BuildingInput from './BuildingInput.svelte';

	$: locid = $locationid;

	let buildingNames: String[] = [];
	let showAddBuilding: boolean = false;
	let newName: String = '';
	let newBuildings: [{id: number, name: string}] = [];
    $newBuildingNames = []

	onMount(async () => {
		await getBuildings.fetch({ variables: { locationid: locid } });
		let buildings = $getBuildings.data?.getBuildingsInLocation;
		for (let building in buildings) {
			buildingNames.push(building.buildingname);
		}
	});


	function handleAddBuilding() {
		showAddBuilding = true;
		const newId: number = newBuildings.length;
		newBuildings.push({ id: newId, name: '' });
		newBuildings = newBuildings;
	}

	function updateNewNames(id: number, newName: string) {
		newBuildings = newBuildings.map((field) =>
			field.id === id ? { ...field, name: newName } : field
		);
        $newBuildingNames = newBuildings.map((building) => 
            building.name
        ) 
	}

	
</script>

<div>
	{#if $showAddLocation}
        <h1>Buildings</h1>
		{#if showAddBuilding}
			{#each newBuildings as { id, name }}
				<div class="input">
					<BuildingInput {id} {name} onInput={(newId, newName) => updateNewNames(newId, newName)} />
					{newName}
				</div>
			{/each}
		{/if}

		<button class="btn variant-filled-primary" on:click={handleAddBuilding}>Add Building</button>
	{/if}
</div>
