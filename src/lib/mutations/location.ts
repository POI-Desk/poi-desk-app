import { graphql } from "$houdini";

export const defaultLocation = graphql(`
	mutation DefaultLocation($uid: ID!, $lid: ID!) {
		setdefaultLocation(userid: $uid, locationid: $lid)
	}
`);
