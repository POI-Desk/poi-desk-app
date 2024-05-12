import { graphql } from '$houdini';

export const usersInTeam = graphql(`
	query getUsersInTeam @load {
		getUsersInTeam {
			pk_userid
			username
		}
	}
`);

export const getUserByid = graphql(`
	query getUserInfo($id: ID) {
		getUserById(id: $id) {
			pk_userid
			username
			roles {
				rolename
			}
			bookings {
				bookingnumber
				date
			}
			location {
				locationname
			}
		}
	}
`);

export const authenticateUser = graphql(`
	query authenticateUser {
		authorizeUser
	}
`);

export const loginWithGoogle = graphql(`
	mutation loginWizzGoogol($auth: String!) {
		loginWizzGoogol(authToken: $auth)
	}
`);
