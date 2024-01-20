<script lang="ts">
    //import { addBuilding } from "$lib/mutations/buildings";
    import { getBuildings } from "$lib/queries/buildingQueries";
	import { onMount } from "svelte";
    import { locationid } from "$lib/locationStore";
    import { showAddLocation } from "$lib/locationStore";
	import Login from "$components/Login.svelte";
	import { saveChangesClickable } from "$lib/saveChangesStore";

    $: locid = $locationid;

    let buildingNames: String[] = [];
    let showAddBuilding: boolean = false;
    let newName: String = "";

    onMount(async () => {
        await getBuildings.fetch({ variables: { locationid: locid } });
        let buildings = $getBuildings.data?.getBuildingsInLocation;
        for (let building in buildings) {
            buildingNames.push(building.buildingname);
        }
    })

    function handleAddBuilding() {
        showAddBuilding = true;
    }

    function handleNameInput() {
		if (newName === '' || newName in buildingNames) {
			saveChangesClickable.set(false);
		} else {
			saveChangesClickable.set(true);
		}
	}

</script>

<div>
    {#if $showAddLocation}
        <button on:click={handleAddBuilding}>Add Building</button>

        {#if showAddBuilding}
        <div class="input">
			<input
				type="text"
				placeholder="Building name"
				bind:value={newName}
				on:input={handleNameInput}
			/>
			{newName}
		</div>
        {/if}
    {/if}

</div>