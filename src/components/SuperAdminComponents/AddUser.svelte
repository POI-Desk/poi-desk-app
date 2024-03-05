<script lang="ts">
  import { addUser } from "$lib/mutations/user";

  let newUsername: string = "";
  let saveUserDisabled: boolean = true;
  let newUserClicked: boolean = false;
  let isExtended: boolean = false;
  let isAdmin: boolean = false;
  let isSuperAdmin: boolean = false;
  let password: string;
  let passwordAgain: string;

  function handleNewUserClick() {
    newUserClicked = !newUserClicked;
  }

  function handleInput() {
    if (newUsername === "") {
      saveUserDisabled = true;
    } else {
      saveUserDisabled = false;
    }
  }

  async function handleSaveUserClick() {
    const result = await addUser.mutate({
      username: newUsername,
      isExtended,
      isAdmin,
      isSuperAdmin,
      password
    });
    console.log(result.data?.addUser?.pk_userid);

  }

</script>

<button class="btn variant-filled-primary" on:click={handleNewUserClick}>
  {#if (newUserClicked)}
    - Add user
  {:else }
    + Add user
  {/if}
</button>

{#if newUserClicked}
  <div class="p-3 flex flex-col gap-2 rounded-xl shadow-around-5">
    <label>
      Username
      <input type="text" class="input input-primary" placeholder="Enter a username" bind:value={newUsername}
             on:input={handleInput}>
    </label>

    <div class="grid grid-cols-2 p-1">
      <div>
        <label>
          <input type="checkbox" disabled checked class="disabled:checkbox">
          is standard user
        </label>
        <label>
          <input type="checkbox" class="checkbox" bind:checked={isExtended}>
          is extended user
        </label>
      </div>
      <div>
        <label>
          <input type="checkbox" class="checkbox" bind:checked={isAdmin}>
          is admin user
        </label>
        <label>
          <input type="checkbox" class="checkbox" bind:checked={isSuperAdmin}>
          is super admin user
        </label>
      </div>

    </div>

    <input class="input" type="password" placeholder="Enter the user's password" bind:value={password}>
    <input class="input" type="password" placeholder="Confirm the user's password" bind:value={passwordAgain}>

    <button class="btn variant-filled-secondary" disabled={saveUserDisabled || password !== passwordAgain || !password}
            on:click={handleSaveUserClick}>Save user
    </button>
  </div>
{/if}
