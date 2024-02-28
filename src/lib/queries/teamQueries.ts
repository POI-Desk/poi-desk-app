import { graphql } from '$houdini';

export const getAllTeams = graphql(`
    query getAllTeams {
        getAllTeams {
            teamname,
            pk_teamid
        }
    }
`)