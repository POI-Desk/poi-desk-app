import { error, redirect } from '@sveltejs/kit';
import type { BeforeLoadEvent, AfterLoadEvent } from './$houdini';

export function _houdini_beforeLoad({ params }: BeforeLoadEvent) {
	if (!params.mapId) {
		return Response.redirect('/admin');
	}

	const regexExp =
		/^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;

	const uuid = regexExp.test(params.mapId);

	if (!uuid) {
		throw error(404);
	}
}

export function _houdini_afterLoad({ data }: AfterLoadEvent) {
	if (!data.getMapSnapshotById.getMapSnapshotById) {
		throw error(404);
	}

	return {};
}
