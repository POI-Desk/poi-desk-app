<script lang="ts">
	import { CachePolicy } from '$houdini';
	import { deleteFloor } from '$lib/mutations/floors';
	import { getFloors } from '$lib/queries/floorQueries';
	import { onMount } from 'svelte';
	import { refreshLocations, locationToEdit, buildingToEdit, floorsToEdit, changedBuidings } from '$lib/superAdminStore';

	$: floors = $getFloors.data?.getFloorsInBuilding;

    $: buildingIdToEdit = $buildingToEdit.id;

	// async function getLocationsFunction() {
	// 	await getLocations.fetch({ policy: CachePolicy.NetworkOnly });
	// }

	async function onDeleteFloor(id: string) {
		const result = await deleteFloor.mutate({
			id: id
		});
		$refreshLocations = !$refreshLocations;
	}

    function handleNameInput(id: string, name: string) {
        
        $changedBuidings.set(id, name);
        $changedBuidings = $changedBuidings;
        console.log("Changed Buildings: " + $changedBuidings.size);


        

		// if ($buildingToEdit.name === '' || $locationNames.includes($locationToEdit.name)) {
		// 	$isSaveDisabled = true;
		// } else {
		// 	$isSaveDisabled = false;
		// }
	}

    function handleFloorNameInput(id: string, name: string) {
        $floorsToEdit.set(id, name);
        $floorsToEdit = $floorsToEdit;

        console.log($floorsToEdit);
        
    }
</script>

<div>
	{#key $refreshLocations}
		{#await getFloors.fetch({variables: {buildingid: buildingIdToEdit}, policy: CachePolicy.NetworkOnly })}
			<p>fetching floors...</p>
		{:then fetched}

            {$buildingToEdit.name}
            <input type="text" class="input" bind:value={$buildingToEdit.name} on:input={() => handleNameInput($buildingToEdit.id, $buildingToEdit.name)}>

			{#each floors as floor}
				<div>
					<div class="variant-outline-primary">
						<!-- {floor.floorname} -->
                        <input type="text" class="input" bind:value={floor.floorname} on:input={() => handleFloorNameInput(floor.pk_floorid, floor.floorname)}>
						<button on:click={() => onDeleteFloor(floor.pk_floorid)}>Delete</button>
					</div>
					<br />
				</div>
			{/each}
		{/await}
	{/key}
</div>
