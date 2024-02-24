import { graphql } from '$houdini';

export const addUser = graphql(`
	mutation addUser($username: String!, $isExtended: Boolean!, $isAdmin: Boolean!, $isSuperAdmin: Boolean!) {
		addUser(username: $username, isExtended: $isExtended, isAdmin: $isAdmin, isSuperAdmin: $isSuperAdmin) {
			pk_userid,
            username,
		}
	}
`);