import type { PageServerLoad } from './$types';

export const load = (async ({cookies}) => {
	const sessionToken = cookies.get('session');
	return {
		sessionToken
	};
}) satisfies PageServerLoad;
