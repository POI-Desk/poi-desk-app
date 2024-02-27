import type { PageServerLoad } from './$types';

export const load = (async (event) => {
	const session = event.locals.getSession();
	return {
		session
	};
}) satisfies PageServerLoad;
