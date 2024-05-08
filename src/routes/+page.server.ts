import type { User } from '$lib/types/userTypes.js';
import { redirect } from '@sveltejs/kit';

export const load = async (event) => {
	const session = event.locals.getSession() as User;
	if (session.location) {
		throw redirect(
			308,
			`/${session.location.locationname}?date=${new Date().toISOString().split('T')[0]}`
		);
	}	

	throw redirect(300, '/locations');
};
