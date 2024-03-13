import {
	CachePolicy,
	getBookingsByDateInLocationAndBuildingNameFloorNameStore,
	getPublishedMapByBuildingNameAndFloorNameStore,
	graphql
} from '$houdini';

const getPublishedMap = graphql(`
	query getPublishedMapByBuildingNameAndFloorName(
		$locationId: ID!
		$buildingName: String!
		$floorName: String!
	) {
		getPublishedMapByLocationBuildingFloorName(
			locationId: $locationId
			buildingName: $buildingName
			floorName: $floorName
		) {
			pk_mapId
			height
			width
			published
			desks {
				pk_deskid
				desknum
				x
				y
				rotation
				bookings {
					date
					ismorning
					isafternoon
				}
				user {
					pk_userid
					username
				}
			}
			rooms {
				pk_roomId
				x
				y
				width
				height
			}
			walls {
				pk_wallId
				x
				y
				rotation
				width
			}
			doors {
				pk_doorId
				x
				y
				rotation
				width
			}
			labels {
				pk_labelId
				text
				x
				y
				rotation
			}
			floor {
				floorname
				building {
					buildingname
				}
			}
		}
	}
`);

const getBookingsByDate = graphql(`
	query getBookingsByDateInLocationAndBuildingNameFloorName(
		$date: String!
		$locationId: ID!
		$floorName: String!
		$buildingName: String!
	) {
		getBookingsByDateInLocationAndBuildingNameFloorName(
			date: $date
			locationId: $locationId
			floorName: $floorName
			buildingName: $buildingName
		) {
			pk_bookingid
			bookingnumber
			isafternoon
			ismorning
			date
			desk {
				pk_deskid
			}
		}
	}
`);

export const load = async (event) => {
	const searchParams = event.url.searchParams;
	if (!event.data.buildings || !event.data.buildings[0].floors) {
		return {
			map: null,
			bookings: null,
			...event.data
		};
	}

	let building = searchParams.get('building');
	if (!building) {
		building = event.data.buildings[0].buildingname;
		searchParams.set('building', building);
	}

	let floor = searchParams.get('floor');
	if (!floor) {
		floor = event.data.buildings[0].floors[0].floorname;
		searchParams.set('floor', floor);
	}

	let date = searchParams.get('date');
	if (!date) {
		date = new Date().toISOString().split('T')[0];
		searchParams.set('date', date);
	}

	const p = new getPublishedMapByBuildingNameAndFloorNameStore();
	const buildingsPromise = p.fetch({
		variables: {
			buildingName: building ?? '',
			floorName: floor ?? '',
			locationId: event.data.session.location!.pk_locationid
		},
		policy: CachePolicy.CacheAndNetwork,
		event
	});

	const b = new getBookingsByDateInLocationAndBuildingNameFloorNameStore();
	const bookingsPromise = b.fetch({
		variables: {
			date: date ?? '',
			locationId: event.data.session.location!.pk_locationid,
			floorName: floor ?? '',
			buildingName: building ?? ''
		},
		policy: CachePolicy.CacheAndNetwork,
		event
	});

	const all = await Promise.all([buildingsPromise, bookingsPromise]);

	return {
		map: p,
		bookings: b,
		...event.data,
        query: {
            building: building,
            floor: floor,
            date: date
        }
	};
};
