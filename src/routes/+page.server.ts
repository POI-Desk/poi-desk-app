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
	const searchParams = event.url.searchParams;

	const b = new getBuildingsAndFloorsInLocationForMapStore();
	const res = await b.fetch({
		variables: { locationId: session.location!.pk_locationid },
		event
	});

	const buildings = res.data?.getBuildingsInLocation;

	if (!buildings|| !buildings[0].floors) {
		return {
			session,
			buildings: null
		};
	}

	let building = searchParams.get('building');
	if (!building) {
		building = buildings[0].buildingname;
		searchParams.set('building', building);
	}

	let floor = searchParams.get('floor');
	if (!floor) {
		floor = buildings[0].floors[0].floorname;
		searchParams.set('floor', floor);
	}

	let date = searchParams.get('date');
	if (!date) {
		date = new Date().toISOString().split('T')[0];
		searchParams.set('date', date);
	}

	return {
		session,
		buildings: res.data?.getBuildingsInLocation,
		query: {
			building,
			floor,
			date
		}
	};
}) satisfies PageServerLoad;
