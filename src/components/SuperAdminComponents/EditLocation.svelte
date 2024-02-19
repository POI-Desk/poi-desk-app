<script lang="ts">
	import { CachePolicy } from '$houdini';
	import { deleteBuilding } from '$lib/mutations/buildings';
	import { getBuildings } from '$lib/queries/buildingQueries';
    import { getLocations } from '$lib/queries/locationQueries';
	import { onMount } from 'svelte';
	import { isSaveDisabled, locationNames, refreshLocations, locationToEdit, buildingToEdit } from '$lib/superAdminStore';
	import AddBuilding from './AddBuilding.svelte';

	$: buildings = $getBuildings.data?.getBuildingsInLocation;

    $: locationIdToEdit = $locationToEdit.id;

	// async function getLocationsFunction() {
	// 	await getLocations.fetch({ policy: CachePolicy.NetworkOnly });
	// }



	async function onDeleteBuilding(id: string) {
		console.log(id);

		const result = await deleteBuilding.mutate({
			id: id
		});
		$refreshLocations = !$refreshLocations;
	}

    function handleNameInput() {
		if ($locationToEdit.name === '' || $locationNames.includes($locationToEdit.name)) {
			$isSaveDisabled = true;
		} else {
			$isSaveDisabled = false;
		}
	}

    
</script>

<div>
	{#key $refreshLocations}

		<AddBuilding />

		{#await getBuildings.fetch({variables: {locationid: locationIdToEdit}, policy: CachePolicy.NetworkOnly })}
			<p>fetching buildings...</p>
		{:then fetched}

            {$locationToEdit.name}
            <input type="text" class="input" bind:value={$locationToEdit.name} on:input={handleNameInput}>
			{#each buildings ?? [] as building}
				<div>
					<div class="variant-outline-primary">
                        
						{building.buildingname}
						<button on:click={() => {
                            $buildingToEdit = {id: building.pk_buildingid, name: building.buildingname};
                        }}>Edit</button> 
						<button on:click={() => onDeleteBuilding(building.pk_buildingid)}>Delete</button>
					</div>
					<br />
				</div>
			{/each}
		{/await}
	{/key}
</div>
