<script lang="ts">
    import { getAllTeams } from '$lib/queries/teamQueries';
	import { CachePolicy } from '$houdini';
	import { onMount } from 'svelte';

    let newTeamClicked: boolean = false;
    let saveTeamDisabled: boolean = true;
    let newTeamName: string = "";
    let currentTeamNames: String[] = [];

    onMount(() => {        
        getTeams();
    })

    async function getTeams() {
        await getAllTeams.fetch({ policy: CachePolicy.NetworkOnly }).then(() => {
			currentTeamNames = [''];
			let teams = $getAllTeams.data?.getAllTeams;

			for (let i = 0; i < teams?.length; i++) {
				currentTeamNames.push(teams?.at(i)?.teamname.toLowerCase() ?? '');
				currentTeamNames = currentTeamNames;
			}
            console.log(currentTeamNames + "HALKDSJFLSAKJFD");
		})
        
    }

    function handleNewTeamClicked() {
        newTeamClicked = true;
    }

    function handleInput() {
        if(newTeamName === "" || currentTeamNames.includes(newTeamName)) {
            saveTeamDisabled = true;
        } else {
            saveTeamDisabled = false;
        }
    }
</script>

<button class="btn variant-filled-secondary" on:click={handleNewTeamClicked}>+ Add team</button>

{#if newTeamClicked}
    <input class="input input-primary" bind:value={newTeamName} on:input={handleInput}>
    <button class="btn variant-filled-secondary" disabled={saveTeamDisabled}>Save team</button>
    
{/if}