import { getLocationByNameStore, graphql } from '$houdini';
import type { User } from '$lib/types/userTypes';
import type { PageServerLoad } from './$types';

const locationByName = graphql(`
	query getLocationByName($name: String!) {
		getLocationByName(name: $name) {
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
	const session = event.locals.getSession() as User;
	const searchParams = event.url.searchParams;

	const l = new getLocationByNameStore();
	const res = await l.fetch({
		variables: { name: event.params.locationName },
		event
	});

	const buildings = res.data?.getLocationByName?.buildings;

	if (!buildings || !buildings[0].floors) {
		return {
			session,
			location: null
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
		location: res.data?.getLocationByName,
		query: {
			building,
			floor,
			date
		}
	};
}) satisfies PageServerLoad;
