<script lang="ts">
	import { addLocation } from "$lib/mutations/locationMutation";
	import { getLocations } from "$lib/queries/locationQueries";
	import { onMount } from "svelte";

	let showAddLocation: boolean = false;
	let newName: string = '';
    let locationNames: string[] = [];
    
    onMount(async () => {
        await getLocations.fetch().then(() => {
            let locations = $getLocations.data?.getAllLocations;
            for (let loc in locations) {
                locationNames.push(loc.locationname)
            }
        })
        
    })

	function onAddLocation() {
		showAddLocation = true;
	}

    async function onSaveChanges() {

        if (!newName) {
            alert("You have to enter a name before saving the building!");
        } else if (newName) {
            alert("A building with this name already exists. Please enter a different name!");
        } else {
            try {
                const result = await addLocation.mutate({
                    name: newName
                });
            } catch (error) {
                console.error('Error:', error);
            }
        }
    }

</script>

<button on:click={onAddLocation}> + </button>

{#if showAddLocation}
	<div>
		<div class="input">
			<input type="text" placeholder="Enter a name" bind:value={newName} />
		</div>
		<div>
			<h2>Buildings</h2>
			<p>Placeholder for building add</p>
		</div>
		<div>
			<h2>Thumbnail</h2>
            <p>placeholder for file upload</p>
		</div>
        <div>
            <button class="btn variant-filled-primary" on:click={onSaveChanges}>
                Save changes
            </button>
        </div>
	</div>
{/if}
