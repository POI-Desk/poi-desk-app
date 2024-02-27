import { page } from '$app/stores';
import { authenticateUser } from '$lib/queries/userQuerries';
import type { Handle } from '@sveltejs/kit';
import { graphql, setSession } from '$houdini';
import { user } from '$lib/userStore';

const getData = graphql(`
	query getData($session: String!) {
		getUserInformation(jwt: $session) {
			pk_userid
			username
			location {
				pk_locationid
				locationname
			}
		}
	}
`);

/*
export const handle: Handle = async ({ event }) => {
	const sessionToken = event.cookies.get('session');
	event.locals.getSession = () => {
		return sessionToken ?? 'Amongus';
	};
	console.log(event.request.url);
	if (event.request.url.includes('/login')) {
		return Promise.resolve;
	}
	return Response.redirect('http://localhost:5173/login', 302);
};
*/

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session');
	const response = await resolve(event);

	const data = await getData.fetch({ variables: { session: sessionToken! }, event});

	event.locals.getSession = () => {
		return data.data?.getUserInformation;
	};

	if (event.request.url.includes('/login')) {
		console.log('The request url inclues login');
		return response;
	}
	if (event.request.url.includes('/api/auth/callback/google')) {
		console.log('The request url inclues /api/auth/callback/google');
		console.log('Callback');
		return response;
	}

	if (!sessionToken) {
		console.log('No session token found');
		if (!event.request.url.includes('/login')) {
			return Response.redirect('http://localhost:5173/login', 302);
		}
		return response;
	}
	setSession(event, { sessionToken });
	//console.log("Session token found:", sessionToken);
	const res = await authenticateUser.fetch({
		event
	});
	//console.log("AuthenticateUser response:", res.data?.authorizeUser);
	if (res.data?.authorizeUser) {
		console.log('User is authorized');
		return await resolve(event);
	} else {
		console.warn('User is not authorized');
		return Response.redirect('http://localhost:5173/login', 302);
	}
};
