import {graphql} from '$houdini';

export const usersInTeam = graphql(`
    query getUsersInTeam @load {
        getUsersInTeam {
            pk_userid
            username
        }
    }
`);

export const authenticateUser = graphql(`
	query authenticateUser{
		authorizeUser
	}
`);


export const loginWizzGoogol = graphql(`
	mutation loginWizzGoogol($auth: String!) {
		loginWizzGoogol(authToken: $auth)
	}
`);

