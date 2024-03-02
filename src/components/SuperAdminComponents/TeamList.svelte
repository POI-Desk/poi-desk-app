<script lang="ts">
	import { getAllTeams } from '$lib/queries/teamQueries';
	import { CachePolicy } from '$houdini';
	import { onMount } from 'svelte';
	import { teamToEdit, refreshTeams } from '$lib/superAdminStore';
	import { deleteTeam } from '$lib/mutations/teams';

	$: teams = $getAllTeams.data?.getAllTeams;

	onMount(() => {
		getTeams();
	});

    $: {
        $refreshTeams;
        getTeams();
    }

	async function getTeams() {
		await getAllTeams.fetch({ policy: CachePolicy.NetworkOnly });
	}

	async function onDeleteTeam(team: any) {
		const result = await deleteTeam
			.mutate({
				teamid: team.pk_teamid
			})
			.then(() => {
				$refreshTeams = !$refreshTeams;
			});
	}
</script>

{#key $refreshTeams}
	{#each teams ?? [] as team}
		{team?.teamname}<button on:click={() => ($teamToEdit = team)}>Edit</button><button
			on:click={() => onDeleteTeam(team)}>Delete</button
		><br />
	{/each}
{/key}
