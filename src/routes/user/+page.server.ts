import type { PageServerLoad } from './$types';

// export const load = (async ({ cookies }) => {
// 	const sessionToken = cookies.get('session');
// 	return {
// 		sessionToken
// 	};
// }) satisfies PageServerLoad;

export const load = (async ({locals}) => {
	const session = locals.getSession();

	return {
		session
	};
}) satisfies PageServerLoad;