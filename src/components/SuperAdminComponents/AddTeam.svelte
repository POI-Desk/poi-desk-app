<script lang="ts">
	import { getAllTeams } from '$lib/queries/teamQueries';
	import { CachePolicy } from '$houdini';
	import { onMount } from 'svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import type { User } from '$lib/types/userTypes';
	import { addTeam } from '$lib/mutations/teams';
	import { getExtendedUsers } from '$lib/queries/userQuerries';

	let newTeamClicked: boolean = false;
	let saveTeamDisabled: boolean = true;
	let newTeamName: string = '';
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
				currentTeamNames.push(teams?.at(i)?.teamname.toLowerCase() ?? '');
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
		newTeamClicked = true;
	}

	function handleInput() {
		if (newTeamName === '' || currentTeamNames.includes(newTeamName.toLowerCase())) {
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
					console.log('MEMEBERES');

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

<button class="btn variant-filled-secondary" on:click={handleNewTeamClicked}>+ Add team</button>

{#if newTeamClicked}
	<input class="input input-primary" bind:value={newTeamName} on:input={handleInput} />
	<SearchBar showUsrInfo={false} on:clicked={handleUserClicked} />

	<div>
		{#each newMembers as newMember}
			<button on:click={() => handleRemoveNewUser(newMember)}>x</button>
			<span>{newMember.username}</span>
		{/each}
	</div>

	<div>
		<h2>Teamleader</h2>
		<select bind:value={teamLeader}>
            {#each extendedUsers as extendedUser}
                <option value={extendedUser}>
                    {extendedUser.username}
                </option>
            {/each}
        </select>
	</div>

	<button
		class="btn variant-filled-secondary"
		disabled={saveTeamDisabled}
		on:click={() => saveNewTeam(newTeamName, newMembers, teamLeader)}>Save team</button
	>
{/if}
