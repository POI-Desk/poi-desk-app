import { error } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { oAuth2Client } from '$lib/auth/googleOAuthClient';
import { load_getQuarterlyBooking } from '$houdini';

export const GET: RequestHandler = async (req) => {
	const code = req.url.searchParams.get('code');

	console.log(code);

	if (!code) {
		throw error(400, 'Missing code');
	}
/*
	const tokenRes = await oAuth2Client.getToken(code);

	console.log(tokenRes.tokens);
*/
	return new Response();
};
