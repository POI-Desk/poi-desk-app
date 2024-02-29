import { graphql } from '$houdini';

export const usersInTeam = graphql(`
	query getUsersInTeam @load {
		getUsersInTeam {
			pk_userid
			username
		}
	}
`);

export const getUserById = graphql(`
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
				pk_locationid
			}
		}
	}
`);

export const getExtendedUsers = graphql(`
	query getExtendedUsers @load {
		getExtendedUsers {
			pk_userid
			username
		}
	}
`);