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

