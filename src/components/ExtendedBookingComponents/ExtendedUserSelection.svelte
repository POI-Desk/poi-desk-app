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

<div class="grid place-items-center place-content-center space-y-6 h-screen">
  <h1 class="text-2xl">Choose Your Team:</h1>
  {#if allUsers}
    {#each allUsers as user}
      <button
        class="btn btn-block variant-filled-primary w-2/3 px-14"
        on:click={() => handleUserSelection(user)}
        class:variant-ghost={newSelectedUsers.includes(user)}
      >

        {user?.username}
      </button>
    {/each}
  {/if}

  <button class="btn variant-filled-primary mt-5" on:click={() => {$selectedUsers = newSelectedUsers}}>Continue</button>
</div>
