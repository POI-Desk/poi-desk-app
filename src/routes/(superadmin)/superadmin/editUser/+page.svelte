<script lang="ts">
  import EditUser from "$components/SuperAdminComponents/EditUser.svelte";
  import SearchBar from "$components/SearchBar.svelte";
  import type { User } from "$lib/types/userTypes";
  import { showTeams, teamToEdit } from "$lib/stores/superAdminStore";
  import AddTeam from "$components/SuperAdminComponents/AddTeam.svelte";
  import AddUser from "$components/SuperAdminComponents/AddUser.svelte";
  import TeamList from "$components/SuperAdminComponents/TeamList.svelte";
  import EditTeam from "$components/SuperAdminComponents/EditTeam.svelte";
  import BurgerMenu from "$components/SuperAdminComponents/BurgerMenu.svelte";
  import { goto } from "$app/navigation";

  let userToEdit: User;

  function handleUserClicked(event) {
    userToEdit = event.detail;
  }

  const btn = "btn variant-filled-primary shadow-md"
</script>

<div class="grid grid-cols-2 gap-5 divide-x-2 divide-black dark:divide-white h-full">

  <div class="flex flex-col p-5 gap-5">
    <h1 class="h2 text-primary-500">Select an option</h1>
    <AddUser />
    <AddTeam />

    <button class="btn variant-filled-primary" on:click={() => ($showTeams = !$showTeams)}>
      {#if $showTeams}
        Hide Teams
      {:else}
        Show Teams
      {/if}
    </button>

    {#if $showTeams}
      <TeamList />
      {#if $teamToEdit}
        <EditTeam />
      {/if}
    {/if}
    <BurgerMenu >
      <button on:click={() => goto("/")} class="{btn}">Home</button>
      <button on:click={() => goto("/superadmin")} class="{btn}">Locations</button>
    </BurgerMenu>
  </div>

  <div class="flex flex-col p-5 gap-5">
    <p class="h2 text-primary-500">Select a user to edit</p>

    <SearchBar showUsrInfo={false} on:clicked={handleUserClicked} />

    <EditUser userToEdit={userToEdit} />
  </div>


</div>