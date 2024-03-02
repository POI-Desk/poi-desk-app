<script lang="ts">
	import { addMemberToTeam, changeNameOfTeam, removeMembersOfTeam } from '$lib/mutations/teams';
	import { getMembersOfTeam } from '$lib/queries/teamQueries';
	import { refreshTeams, teamToEdit } from '$lib/superAdminStore';
	import { CachePolicy } from '$houdini';
	import { onMount } from 'svelte';
	import type { User } from '$lib/types/userTypes';
	import SearchBar from '$components/SearchBar.svelte';

	let newTeamName: string;
	let membersToRemove: [] = [];
	let refreshMembers: boolean = false;
	let newMembers: [] = [];

	$: members = $getMembersOfTeam.data?.getMembersOfTeam;

	$: {
		$teamToEdit;
		getTeamMembers();
		refreshMembers = !refreshMembers;
	}

	onMount(() => {
		getTeamMembers();
	});

	/**
	 * saves the changes made to a team
	 */
	async function handleSaveTeam() {
		const resultNameChange = await changeNameOfTeam
			.mutate({
				teamid: $teamToEdit.pk_teamid,
				newName: newTeamName
			})
			.then(() => {
				$refreshTeams = !$refreshTeams;
			});


        /**
         * remove members from team
         */
		let memberIdsToRemove = membersToRemove.map((m) => m.pk_userid);

		const resultRemoveUsers = await removeMembersOfTeam
			.mutate({
				teamid: $teamToEdit.pk_teamid,
				userids: memberIdsToRemove
			})
			.then(() => {
				getTeamMembers();
			});

        /**
         * add members to team
         */
		let newMemberIds: any[] = newMembers.map((m) => m.pk_userid);

		const resultAddUsers = await addMemberToTeam
			.mutate({
				teamid: $teamToEdit.pk_teamid,
				userids: newMemberIds
			})
			.then(() => {
				getTeamMembers();
			});

		membersToRemove = [];
		newMembers = [];
		refreshMembers != refreshMembers;
	}

	/**
	 * gets all members of the selected team
	 */
	async function getTeamMembers() {
		await getMembersOfTeam.fetch({
			policy: CachePolicy.NetworkOnly,
			variables: { teamid: $teamToEdit.pk_teamid }
		});
	}

	function handleRemoveMember(member) {
		membersToRemove.push(member);
		console.log(membersToRemove);
	}

	function handleUserClicked(event) {
		let memberIds = members?.map((m) => m?.pk_userid);

		if (newMembers.includes(event.detail) || memberIds?.includes(event.detail.pk_userid)) {
			alert('nein stopp');
		} else {
			newMembers.push(event.detail);
			newMembers = newMembers;
			console.log(newMembers);
		}
	}
</script>

<input
	type="text"
	placeholder={$teamToEdit.teamname}
	bind:value={newTeamName}
/>{$teamToEdit.pk_teamid}<br />

{#key refreshMembers}
	{#each members ?? [] as member}
		<button on:click={() => handleRemoveMember(member)}>X</button>{member?.username}<br />
	{/each}
{/key}

<SearchBar showUsrInfo={false} on:clicked={handleUserClicked} />

<button on:click={() => handleSaveTeam()}>Save team</button>
