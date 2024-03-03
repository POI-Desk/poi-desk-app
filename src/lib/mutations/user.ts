import { graphql } from '$houdini';

export const addUser = graphql(`
	mutation addUser($username: String!, $isExtended: Boolean!, $isAdmin: Boolean!, $isSuperAdmin: Boolean!, $password: String!) {
		addUser(username: $username, isExtended: $isExtended, isAdmin: $isAdmin, isSuperAdmin: $isSuperAdmin, password: $password) {
			pk_userid,
            username,
		}
	}
`);

export const setAdminLocation = graphql(`
	mutation setAdminLocation($userid: ID!, $locationid: ID!) {
		setAdminLocation(userid: $userid, locationid: $locationid) {
			pk_locationid,
            locationname
		}
	}
`);

export const removeAdminLocation = graphql(`
	mutation removeAdminLocation($userid: ID!) {
		removeAdminLocation(userid: $userid) {
			pk_userid,
            username
		}
	}
`);

export const changePassword = graphql(`
	mutation changePassword($userid: ID!, $oldPassword: String!, $newPassword: String!) {
		changePassword(userid: $userid, oldPassword: $oldPassword, newPassword: $newPassword) {
			pk_userid,
            username
		}
	}
`);

export const resetPassword = graphql(`
	mutation resetPassword($userid: ID!, $newPassword: String!) {
		resetPassword(userid: $userid, newPassword: $newPassword) {
			pk_userid,
            username
		}
	}
`);