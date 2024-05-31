import { loginWithGoogle } from '$lib/queries/userQuerries';
import { error, redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (req) => {
	const code = req.url.searchParams.get('code');

	if (!code) {
		throw error(400, 'Missing code parameter in the query string');
	}

	const res = await loginWithGoogle.mutate(
		{ auth: code },
		{ event: req }
	);

	if (res.errors) {
		throw error(400, 'Missing code parameter in the query string' + res.errors[0].message);
	}

	const id = res.data?.loginWizzGoogol as string;

	req.cookies.set('session', id, {
		path: '/',
		httpOnly: true,
		sameSite: 'lax'
	});



	throw redirect(302, '/');
};

// export const GET: RequestHandler = await (req) => {
// code = req.url.searchParams.get('code');

// console.log(code);

// if (!code) {
// 	return error(400, 'Missing code parameter in the query string');
// }

// const res = await loginWizzGoogol.mutate(
// 	{
// 		auth: code
// 	},
// 	{ event: req }
// );

// if (res.errors)
// 	return error(400, 'Missing code parameter in the query string' + res.errors[0].message);

// console.log(res.data?.loginWizzGoogol);
// const id: string = res.data?.loginWizzGoogol as string;

// req.cookies.set('session-token', id, {
// 	httpOnly: true,
// 	sameSite: 'lax',
// 	maxAge: 60 * 60 * 24 * 7
// });

// return redirect(302, '/');
// };
