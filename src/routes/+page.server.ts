import { getBuildingsAndFloorsInLocationForMapStore, graphql } from '$houdini';
import type { User } from '$lib/types/userTypes';
import type { PageServerLoad } from './$types';

const buildingsForMap = graphql(`
	query getBuildingsAndFloorsInLocationForMap($locationId: ID!) {
		getBuildingsInLocation(locationid: $locationId) {
			pk_buildingid
			buildingname
			floors {
				pk_floorid
				floorname
			}
		}
	}
`);

export const load = (async (event) => {
	const session = event.locals.getSession() as User;

	const b = new getBuildingsAndFloorsInLocationForMapStore();
	const res = await b.fetch({
		variables: { locationId: session.location!.pk_locationid },
		event
	});

	return {
		session,
		buildings: res.data?.getBuildingsInLocation
	};
}) satisfies PageServerLoad;
