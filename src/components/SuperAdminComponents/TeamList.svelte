<script lang="ts">
	import { getAllTeams } from '$lib/queries/teamQueries';
	import { CachePolicy } from '$houdini';
	import { onMount } from 'svelte';
	import { teamToEdit } from '$lib/superAdminStore';
	import { deleteTeam } from '$lib/mutations/teams';

	$: teams = $getAllTeams.data?.getAllTeams;

	let refreshTeams: boolean = false;

	onMount(() => {
		getTeams();
	});

	async function getTeams() {
		await getAllTeams.fetch({ policy: CachePolicy.NetworkOnly });
	}

	async function onDeleteTeam(team: any) {
		const result = await deleteTeam
			.mutate({
				teamid: team.pk_teamid
			}).then(() => {
                console.log(team);
                
                console.log(teams?.indexOf(team));
                
                teams?.splice(teams.indexOf(team), 1);
                teams = teams;
                console.log(teams);
                
                refreshTeams = !refreshTeams;
            });
	}
</script>

{#key refreshTeams}
	{#each teams ?? [] as team}
		{team?.teamname}<button on:click={() => ($teamToEdit = true)}>Edit</button><button
			on:click={() => onDeleteTeam(team)}>Delete</button
		><br />
	{/each}
{/key}
