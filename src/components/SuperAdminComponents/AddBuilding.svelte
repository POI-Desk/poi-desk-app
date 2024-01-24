<script lang="ts">
    //import { addBuilding } from "$lib/mutations/buildings";
    import { getBuildings } from "$lib/queries/buildingQueries";
	import { onMount } from "svelte";
    import { locationid } from "$lib/locationStore";
    import { showAddLocation } from "$lib/locationStore";
	import Login from "$components/Login.svelte";
	import { saveChangesClickable } from "$lib/saveChangesStore";
    import { addBuilding } from '$lib/mutations/buildings';
    import BuildingInput from "./BuildingInput.svelte";

    $: locid = $locationid;

    let buildingNames: String[] = [];
    let showAddBuilding: boolean = false;
    let newName: String = "";
    let newBuildings: String[] = [];
    let newBuildingNames: String[] = [];
    let inputFields: { id: number; value: string }[] = [];

    onMount(async () => {
        await getBuildings.fetch({ variables: { locationid: locid } });
        let buildings = $getBuildings.data?.getBuildingsInLocation;
        for (let building in buildings) {
            buildingNames.push(building.buildingname);
        }
    })

    function handleAddBuilding() {
        showAddBuilding = true;
        const newId: number = inputFields.length;
        console.log(newBuildingNames)
        newBuildingNames.push({id: newId, value: ''})
        newBuildingNames = newBuildingNames
        //newBuildingNames = [...newBuildingNames, {id: newId, value: ''}];
    }

    function updateNewNames(id: number, newValue: string) {
        inputFields = inputFields.map((field) =>
            field.id === id ? { ...field, value: newValue } : field
        );
    }

    function handleNameInput() {
		if (newName === '' || newName in buildingNames) {
			saveChangesClickable.set(false);
		} else {
			saveChangesClickable.set(true);
		}
	}

    function handleSaveChanges(value: boolean) {
        let newNameTaken: boolean = false;
        if (value) {
            for (const name of newBuildingNames) {
                if (name in buildingNames) {
                    newNameTaken = true;
                }
            }
            if ("" in newBuildingNames) {
                alert("Missing building name");
            } else if (newNameTaken) {
                alert("Duplicate building name");
            // } else {
            //     try {
                    
            //     }
            }
        }
    }

</script>

<div>
    {#if $showAddLocation}
        <button on:click={handleAddBuilding}>Add Building</button>

        {#if showAddBuilding}
            {#each newBuildingNames as { id, value }}
                <div class="input">
                    <BuildingInput
                        id={id}
                        value={value}
                        onInput={(newId, newVal) => updateNewNames(newId, newVal)}
                    />
                    {newName}
                </div>
            {/each}
        {/if}
    {/if}

</div>