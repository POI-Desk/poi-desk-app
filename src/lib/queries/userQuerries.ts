import {graphql} from '$houdini';

export const usersInTeam = graphql(`
    query getUsersInTeam @load {
        getUsersInTeam {
            pk_userid
            username
        }
    }
`);
