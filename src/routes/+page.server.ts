import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = locals.getSession();

	return {
		session
	};
}) satisfies PageServerLoad;
