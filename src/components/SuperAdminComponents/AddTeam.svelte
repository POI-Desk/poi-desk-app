<script lang="ts">
  import { getAllTeams } from "$lib/queries/teamQueries";
  import { CachePolicy } from "$houdini";
  import { onMount } from "svelte";
  import SearchBar from "$components/SearchBar.svelte";
  import type { User } from "$lib/types/userTypes";
  import { addTeam } from "$lib/mutations/teams";
  import { getExtendedUsers } from "$lib/queries/userQueries";
  import { showTeams } from "$lib/stores/superAdminStore";

  let newTeamClicked: boolean = false;
  let saveTeamDisabled: boolean = true;
  let newTeamName: string = "";
  let currentTeamNames: String[] = [];
  let newMemberIds: User[] = [];
  let newMembers: User[] = [];
  let extendedUsers: User[] = [];
  let teamLeader: User;

  onMount(() => {
    getTeams();
    getExtendedUsrs();
  });

  /**
   * writes all team names into an array to later check, whether a teamname already exists
   */
  async function getTeams() {
    await getAllTeams.fetch({ policy: CachePolicy.NetworkOnly }).then(() => {
      currentTeamNames = [];
      let teams = $getAllTeams.data?.getAllTeams;

      for (let i = 0; i < teams?.length; i++) {
        currentTeamNames.push(teams?.at(i)?.teamname.toLowerCase() ?? "");
        currentTeamNames = currentTeamNames;
      }
    });
  }

  async function getExtendedUsrs() {
    await getExtendedUsers.fetch({ policy: CachePolicy.NetworkOnly }).then(() => {
      extendedUsers = [];
      extendedUsers = $getExtendedUsers.data?.getExtendedUsers;
    });
  }

  function handleNewTeamClicked() {
    newTeamClicked = !newTeamClicked;
  }

  function handleInput() {
    if (newTeamName === "" || currentTeamNames.includes(newTeamName.toLowerCase())) {
      saveTeamDisabled = true;
    } else {
      saveTeamDisabled = false;
    }
  }

  /**
   * adds a user to the newMembers array
   * @param event
   */
  function handleUserClicked(event) {
    newMembers.push(event.detail);
    newMembers = newMembers;
    console.log(newMemberIds);
  }

  /**
   * saves a new team
   * @param newTeamName name of the new team
   * @param newMembers User[] list of members
   */
  async function saveNewTeam(newTeamName: string, newMembers: User[], newTeamLeader: User) {
    newMemberIds = newMembers.map((m) => m.pk_userid);
    if (!saveTeamDisabled) {
      const result = await addTeam
        .mutate({
          name: newTeamName,
          memberids: newMemberIds,
          leaderid: newTeamLeader.pk_userid
        })
        .then((value) => {
          console.log("MEMEBERES");

          console.log(value.data?.addTeam?.teammembers);

          getTeams();
          saveTeamDisabled = true;
        });
    }
  }

  /**
   * removes a user from the newMembers of a team
   * @param newMember the member to be removed
   */
  function handleRemoveNewUser(newMember: User) {
    let index = newMembers.indexOf(newMember);
    newMembers.splice(index, 1);
    newMembers = newMembers;
  }

</script>

<button class="btn variant-filled-primary" on:click={handleNewTeamClicked}>
  {#if (newTeamClicked)}
    - Add team
  {:else }
    + Add team
  {/if}
</button>

{#if newTeamClicked}
  <div class="p-3 flex flex-col gap-2 rounded-xl shadow-around-5">

    <label>
      <span>Team Name</span>
      <input class="input input-primary" placeholder="Enter a team name" bind:value={newTeamName} on:input={handleInput} />
    </label>

    <span>Add Users</span>
    <SearchBar showUsrInfo={false} on:clicked={handleUserClicked} />

    <div class="flex flex-col gap-1">
      {#each newMembers as newMember}
        <div class="flex flex-row gap-1 align-middle">
          <button class="flex align-middle font-bold" on:click={() => handleRemoveNewUser(newMember)}>X</button>
          <span>{newMember.username}</span>
        </div>
      {/each}
    </div>

    <div>
      <span>Select a teamleader</span>
      <select class="select" bind:value={teamLeader}>
        {#each extendedUsers as extendedUser}
          <option value={extendedUser}>
            {extendedUser.username}
          </option>
        {/each}
      </select>
    </div>

    <button
      class="btn variant-filled-primary"
      disabled={saveTeamDisabled}
      on:click={() => saveNewTeam(newTeamName, newMembers, teamLeader)}>Save team
    </button
    >
  </div>
{/if}
