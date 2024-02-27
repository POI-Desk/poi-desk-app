import { createAuthURI } from '$lib/auth/google';
import { redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

export const actions = {
	default: async () => {
		const authUrl = createAuthURI();

		throw redirect(302, authUrl);
	}
} satisfies Actions;
