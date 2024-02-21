import { goto } from '$app/navigation';
import { page } from '$app/stores';
import { load_getMapSnapshotById } from '$houdini';
import { error } from '@sveltejs/kit';

export const load = async (event) => {
	const param = event.url.searchParams.get('map');
	if (!param) {
		return {...(await load_getMapSnapshotById(event))}
	}

	const loadSnapshot = await load_getMapSnapshotById({
		event,
		variables: { mapId: param ?? '' },
		then: (e) => {
			if (!e?.getMapSnapshotById){
				goto(`?`);
			}
		}
	});

	return {
		...(loadSnapshot)
	};
};
