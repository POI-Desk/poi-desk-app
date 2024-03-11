<script lang="ts">
  import { resetPassword, deleteUser } from "$lib/mutations/user";
  import type { User } from "$lib/types/userTypes";

  export let userToEdit: User;

  let newPassword: string;
  let showChangePassword: boolean = false;

  async function saveUser() {

    /**
     * save password changes
     */
    if (newPassword) {
      const passwordResult = await resetPassword
        .mutate({
          userid: userToEdit.pk_userid,
          newPassword
        });
    }
  }

  async function removeUser() {
    const deleteResult = await deleteUser
      .mutate({
        userid: userToEdit.pk_userid
      });

    userToEdit = undefined;
  }
</script>

{#if userToEdit}
  <h3 class="h3">Edit User {userToEdit.username}</h3>
  <button class="btn variant-filled-primary" on:click={() => (showChangePassword = true)}
  >Change password
  </button
  >

  {#if showChangePassword}
    <span>New Password</span>
    <input placeholder="Enter new password" class="input" bind:value={newPassword} />
  {/if}

  <button class="btn variant-filled-error text-white" on:click={removeUser}>Delete</button>
  <button class="btn variant-filled-primary" on:click={saveUser}>Save</button>
{/if}
