import { graphql } from '$houdini';

export const getAllTeams = graphql(`
    query getAllTeams {
        getAllTeams {
            teamname,
            pk_teamid
        }
    }
`);

export const getMembersOfTeam = graphql(`
	query getMembersOfTeam($teamid: ID!) {
		getMembersOfTeam(teamid: $teamid) {
			pk_userid
			username
		}
	}
`);