import type { PageServerLoad } from './$types';
import { CachePolicy, getLocationByNameStore, graphql } from '$houdini';
import { getUserByid } from '$lib/queries/userQuerries';

const locationByNamePrediction = graphql(`
	query getLocationByNamePrediction($name: String!) {
		getLocationByName(name: $name) {
			pk_locationid
			locationname
			buildings {
				pk_buildingid
				buildingname
				floors {
					pk_floorid
					floorname
				}
			}
		}
	}
`);

export const load = (async (event) => {
	const session = event.locals.getSession();

	const res = await getUserByid.fetch({
		event,
		variables: { id: session.pk_userid },
		policy: CachePolicy.NetworkOnly
	});

	const location = await locationByNamePrediction.fetch({
		variables: { name: res.data?.getUserById?.location?.locationname as string },
		event
	});

	return {
		location
	};
}) satisfies PageServerLoad;
