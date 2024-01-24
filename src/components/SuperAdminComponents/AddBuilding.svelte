<script lang="ts">
    //import { addBuilding } from "$lib/mutations/buildings";
    import { getBuildings } from "$lib/queries/buildingQueries";
	import { onMount } from "svelte";
    import { locationid } from "$lib/locationStore";
    import { showAddLocation } from "$lib/locationStore";
	import Login from "$components/Login.svelte";
	import { isSaveDisabled } from "$lib/saveChangesStore";
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
    }

    function updateNewNames(id: number, newValue: string) {
        inputFields = inputFields.map((field) =>
            field.id === id ? { ...field, value: newValue } : field
        );
    }

    function handleNameInput() {
		if (newName === '' || buildingNames.includes(newName)) {
			$isSaveDisabled = true;
		}else {
			$isSaveDisabled = false;
		}
	}

    function handleSaveChanges(value: boolean) {
        let newNameTaken: boolean = false;
        if (value) {
            for (const name of newBuildingNames) {
                if (buildingNames.includes(name)) {
                    newNameTaken = true;
                }
            }
            if (newBuildingNames.includes("")) {
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
        <button class="btn variant-filled-primary"
         on:click={handleAddBuilding}>Add Building</button>

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