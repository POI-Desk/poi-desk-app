import {graphql} from "$houdini";

export const usersInTeam = graphql(`
    query getUsersInTeam @load {
        getUsersInTeam {
            username
        }
    }
`);