import { graphql } from '$houdini';

export const addTeam = graphql(`
	mutation addTeam($name: String!, $memberids: [ID!]!) {
		addTeam(name: $name, memberids: $memberids) {
			pk_teamid
			teamname
			teammembers {
				username
			}
		}
	}
`);
