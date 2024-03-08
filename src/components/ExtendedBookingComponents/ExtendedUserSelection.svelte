<script lang="ts">
  import { onMount } from "svelte";
  import type { User } from "$lib/types/userTypes";
  import { selectedUsers } from "$lib/stores/extendedUserStore";
  import { user } from "$lib/stores/userStore";
  import { getMembersOfTeam, getTeamsOfLeader } from "$lib/queries/teamQueries";
  import { CachePolicy } from "$houdini";
  import type { Team } from "$lib/types/teamType";

  let selectedTeam: Team;
  let showTeamsOfLeader: boolean = true;
  let newSelectedUsers: User[] = [];

  $: teamMembers = $getMembersOfTeam?.data?.getMembersOfTeam;
  $: teamsOfLeader = $getTeamsOfLeader?.data?.getTeamsOfLeader;

  $: if (selectedTeam) {
    $user.teams = teamsOfLeader;
    getMembersOfTeam.fetch({
      variables: { teamid: selectedTeam.pk_teamid },
      policy: CachePolicy.NetworkOnly
    });
  }

  onMount(async () => {
    await getTeamsOfLeader.fetch({
      variables: { userid: $user.pk_userid },
      policy: CachePolicy.NetworkOnly
    });
  });

  function handleUserSelection(user: User) {
    if (newSelectedUsers.includes(user)) {
      newSelectedUsers.splice(newSelectedUsers.indexOf(user), 1);
    } else {
      newSelectedUsers.push(user);
    }

    newSelectedUsers = newSelectedUsers;
  }
</script>


<div class="grid place-items-center place-content-center space-y-6 h-screen">
  {#if (showTeamsOfLeader && teamsOfLeader)}
    <h1 class="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h1 text-primary-500-400-token text-center">Please select a
      team</h1>
    {#each teamsOfLeader as team}
      <button
        class="btn btn-block w-2/3 py-3 px-32 variant-filled-primary shadow-md"
        on:click={() => {
          showTeamsOfLeader = false;
          selectedTeam = team;
        }}
      >
        {team?.teamname}
      </button>
    {/each}
  {:else if (teamMembers)}
    <h1 class="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h1 text-primary-500-400-token text-center">Please select
      users</h1>
    {#each teamMembers as user}
      <button
        class="btn btn-block w-2/3 py-3 px-32"
        on:click={() => handleUserSelection(user)}
        class:variant-filled-secondary={!newSelectedUsers.includes(user)}
        class:variant-filled-primary={newSelectedUsers.includes(user)}
      >
        {user?.username}
      </button>
    {/each}

    <button class="absolute bottom-24 left-1/2 transform -translate-x-1/2 -translate-y-1/2 btn variant-filled-primary mt-5"
            on:click={() => {$selectedUsers = newSelectedUsers}}>Confirm Selection
    </button>
  {/if}
</div>
