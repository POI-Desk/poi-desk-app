import { graphql } from '$houdini';

export const defaultLocation = graphql(`
	mutation DefaultLocation($lid: ID!) {
		setdefaultLocation(locationid: $lid)
	}
`);
