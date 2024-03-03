import { graphql } from '$houdini';

export const addTeam = graphql(`
	mutation addTeam($name: String!, $memberids: [ID!]!, $leaderid: ID!) {
		addTeam(name: $name, memberids: $memberids, leaderid: $leaderid) {
			pk_teamid
			teamname
			teammembers {
				username
			}
		}
	}
`);

export const deleteTeam = graphql(`
	mutation deleteTeam($teamid: ID!) {
		deleteTeam(teamid: $teamid) {
			pk_teamid
			teamname
		}
	}
`);


export const changeNameOfTeam = graphql(`
	mutation changeNameOfTeam($teamid: ID!, $newName: String!) {
		changeNameOfTeam(teamid: $teamid, newName: $newName) {
			pk_teamid
			teamname
		}
	}
`);

export const removeMembersOfTeam = graphql(`
	mutation removeMembersOfTeam($teamid: ID!, $userids: [ID!]!) {
		removeMembersOfTeam(teamid: $teamid, userids: $userids) {
			pk_userid
			username
		}
	}
`);

export const addMemberToTeam = graphql(`
	mutation addMemberToTeam($teamid: ID!, $userids: [ID!]!) {
		addMemberToTeam(teamid: $teamid, userids: $userids) {
			pk_userid
			username
		}
	}
`);