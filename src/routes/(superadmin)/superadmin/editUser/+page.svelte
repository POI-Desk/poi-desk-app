<script lang="ts">
    import EditUser from '$components/SuperAdminComponents/EditUser.svelte';
    import SearchBar from '$components/SearchBar.svelte';
	import type { User } from '$lib/types/userTypes';
    import { showTeams, teamToEdit } from "$lib/superAdminStore";
    import AddTeam from "$components/SuperAdminComponents/AddTeam.svelte";
    import AddUser from "$components/SuperAdminComponents/AddUser.svelte";
    import TeamList from "$components/SuperAdminComponents/TeamList.svelte";
    import EditTeam from "$components/SuperAdminComponents/EditTeam.svelte";

    let userToEdit: User;

    function handleUserClicked(event) {
        userToEdit = event.detail;
    }
</script>


<AddTeam />
<AddUser />

{#if !$showTeams}
  <button class="btn variant-filled-primary" on:click={() => ($showTeams = true)}>Teams</button>
{:else}
  <TeamList />
  <button on:click={() => $showTeams = false}>Back</button>
  {#if $teamToEdit.pk_teamid !== ""}
    <EditTeam />
  {/if}
{/if}


<p>Select a user to edit</p>

<SearchBar showUsrInfo={false} on:clicked={handleUserClicked} />


<EditUser userToEdit={userToEdit} />