<script lang="ts">
  import { onMount } from "svelte";
  import { usersInTeam } from "$lib/queries/userQuerries";
  import type { User } from "$lib/types/userTypes";
  import { selectedUsers } from "$lib/stores/extendedUserStore";

  $: allUsers = $usersInTeam?.data?.getUsersInTeam;

  let newSelectedUsers: User[] = [];

  onMount(async () => {
    await usersInTeam.fetch();
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


<h1 class="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h1 text-primary-500">Select Users</h1>

<div class="grid place-items-center place-content-center space-y-6 h-screen">
  {#if allUsers}
    {#each allUsers as user}
      <button
        class="btn btn-block w-2/3 py-3 px-32"
        on:click={() => handleUserSelection(user)}
        class:variant-filled-secondary={!newSelectedUsers.includes(user)}
        class:variant-filled-primary={newSelectedUsers.includes(user)}
      >

        {user?.username}
      </button>
    {/each}
  {/if}
</div>

<button class="absolute bottom-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 btn variant-filled-primary mt-5" on:click={() => {$selectedUsers = newSelectedUsers}}>Confirm Selection</button>
