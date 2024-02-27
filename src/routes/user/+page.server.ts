import { CachePolicy } from '$houdini';
import { getUserByid } from '$lib/queries/userQuerries';
import type { PageLoad } from '../$types';
import type { PageServerLoad } from './$types';

// export const load = (async ({ cookies }) => {
// 	const sessionToken = cookies.get('session');
// 	return {
// 		sessionToken
// 	};
// }) satisfies PageServerLoad;

export const load = (async (event) => {
	const sessionToken = event.cookies.get('session');
	const session = event.locals.getSession();

	// TODO: gets called very often 🤣😂
	const res = await getUserByid.fetch({
		event,
		variables: { id: session.pk_userid },
		policy: CachePolicy.NetworkOnly
	});

	return {
		sessionToken: sessionToken,
		session: session,
		res: res
	};
}) satisfies PageServerLoad;
