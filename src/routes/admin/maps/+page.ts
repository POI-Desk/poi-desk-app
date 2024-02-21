import { page } from '$app/stores';
import { load_getMapSnapshotById } from '$houdini';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
	const param = event.url.searchParams.get('map');
	if (!param) {
		error(404, 'map not found');
	}

	return {
		...(await load_getMapSnapshotById({
			event,
			variables: { mapId: param ?? '' }
		}))
	};
};
