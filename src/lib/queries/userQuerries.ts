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
	query authenticateUser($token: String!) {
		authorizeUser(token: $token)
	}
`);


export const loginWizzGoogol = graphql(`
	mutation loginWizzGoogol($auth: String!) {
		loginWizzGoogol(authToken: $auth)
	}
`);

