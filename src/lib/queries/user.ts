import { graphql } from '$houdini';

export const getUsersWithNoDesk = graphql(`
    query getUsersWithNoDesk {
        getUsersWithNoDesk {
            pk_userid
            username
        }
    }
`);
