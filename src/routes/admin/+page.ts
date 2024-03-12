import { goto } from '$app/navigation';
import { CachePolicy, getMapSnapshotsByLocationBuildingFloorNameStore, graphql } from '$houdini';
import { error, redirect } from '@sveltejs/kit';

const snapshots = graphql(`
	query getMapSnapshotsByLocationBuildingFloorName(
		$locationId: ID!
		$buildingName: String!
		$floorName: String!
	) {
		getMapSnapshotsByLocationBuildingFloorName(
			locationId: $locationId
			buildingName: $buildingName
			floorName: $floorName
		) {
			pk_mapId
			name
			createdOn
			updatedOn
		}
	}
`);

export const load = async (event) => {
	const searchParams = event.url.searchParams;

	const building = searchParams.get('building');
	const floor = searchParams.get('floor');

	const s = new getMapSnapshotsByLocationBuildingFloorNameStore();
	await s.fetch({
		variables: {
			buildingName: building ?? '',
			floorName: floor ?? '',
			locationId: event.data.session.location.pk_locationid
		},
		policy: CachePolicy.NetworkOnly,
		event
	});

	return {
		snapshots: s,
		...event.data
	};
};
