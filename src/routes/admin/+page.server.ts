import { getBuildingsAndFloorsInLocationStore, graphql } from '$houdini';
import type { PageServerLoad } from './$types';

const buildingsForSnapshots = graphql(`
	query getBuildingsAndFloorsInLocation($locationId: ID!) {
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

export const load: PageServerLoad = async (event) => {
	const session = event.locals.getSession();

	const b = new getBuildingsAndFloorsInLocationStore();
	const res = await b.fetch({
		variables: { locationId: session.location.pk_locationid },
		event
	});

	return {
		buildings: res.data?.getBuildingsInLocation,
		session: session
	};
};
