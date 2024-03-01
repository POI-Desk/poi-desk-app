import { graphql } from '$houdini';

export const addUser = graphql(`
	mutation addUser($username: String!, $isExtended: Boolean!, $isAdmin: Boolean!, $isSuperAdmin: Boolean!) {
		addUser(username: $username, isExtended: $isExtended, isAdmin: $isAdmin, isSuperAdmin: $isSuperAdmin) {
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