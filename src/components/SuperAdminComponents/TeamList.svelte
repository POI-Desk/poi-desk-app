<script lang="ts">
  import { getAllTeams } from "$lib/queries/teamQueries";
  import { CachePolicy } from "$houdini";
  import { onMount } from "svelte";
	import { teamToEdit, refreshTeams, buildingToEdit } from "$lib/stores/superAdminStore";
  import { deleteTeam } from "$lib/mutations/teams";
	import { PenLine, Trash2 } from "lucide-svelte";

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
		<div class="input p-1 grid grid-cols-4 gap-1">
			<div class="col-span-2 text-center bg-white rounded-full p-2 bold">{team?.teamname}</div>

			<button
				class="btn flex justify-center items-center variant-filled-primary"
				on:click={() => {
                $teamToEdit = team;
							}}>
				<PenLine />
			</button>

			<button
				class="btn flex justify-center items-center variant-filled-error text-white"
				on:click={() => onDeleteTeam(team)}>
				<Trash2 />
			</button>
		</div>
  {/each}
{/key}
