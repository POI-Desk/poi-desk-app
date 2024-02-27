<script lang="ts">
	//import { addBuilding } from "$lib/mutations/buildings";
	import { getBuildings } from '$lib/queries/buildingQueries';
	import { onMount } from 'svelte';
	import AddFloor from "$components/SuperAdminComponents/AddFloor.svelte";
	import { locationid } from '$lib/locationStore';
	import { showAddLocation } from '$lib/locationStore';
	import { isSaveDisabled, editBuildingclicked, newFloors } from '$lib/superAdminStore';
	import BuildingInput from './BuildingInput.svelte';
	import type { UUID } from 'crypto';
    import {v4 as uuidv4} from 'uuid';


    export let buildingId = "";
	let floorNames: String[] = [];
	let showAddFloor: boolean = false;
	let newName: String = '';
    $newFloors = [];
	

	function handleAddFloor() {
		showAddFloor = true;
        const newId = uuidv4();
		$newFloors.push({buildingid: buildingId, id: newId, name: '' });
		$newFloors = $newFloors;
	}

	function updateNewNames(id: uuidv4, newName: string) {
		$newFloors = $newFloors.map((field) =>
			field.id === id ? { ...field, name: newName } : field
		);
	}

	function removeBuildingInput(id: uuidv4, name: string) {
		//const index = newBuildings.indexOf({ id, name });
		const index = $newFloors.findIndex((b) => b.id === id)
		console.log(id + " " + name);
		
		
		$newFloors.splice(index, 1);
		$newFloors = $newFloors;
	}
</script>

<div>
		<h1>Floors</h1>
		{#if showAddFloor}
			
			{#each $newFloors as { id, name }}
				<div class="input">
					<BuildingInput {id} {name} onInput={(newId, newName) => updateNewNames(newId, newName)} />
					<button on:click={() => removeBuildingInput(id, name)}>x</button>
					{id + "" + name}
					<button on:click={() => {
						// editedBuildingId = id;
						$editBuildingclicked = true;
						}}>edit</button>
				</div>
			{/each}
		{/if}

		<div>
			<button class="btn variant-filled-primary" on:click={handleAddFloor}>Add floor</button>
		</div>
</div>
