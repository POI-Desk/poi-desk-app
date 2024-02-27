import type { PageServerLoad } from './$types';

export const load = (async ({ locals }) => {
	const session = locals.getSession();
	console.log('Test', session);
	return {
		session
	};
}) satisfies PageServerLoad;
