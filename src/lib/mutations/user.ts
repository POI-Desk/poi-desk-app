import { graphql } from '$houdini';

export const addUser = graphql(`
	mutation addUser($username: String!) {
		addUser(username: $username) {
			pk_userid,
            username,
		}
	}
`);