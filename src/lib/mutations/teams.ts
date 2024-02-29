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
