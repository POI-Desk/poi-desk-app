import { graphql, setSession } from '$houdini';
import { authenticateUser } from '$lib/queries/userQuerries';
import type { Handle } from '@sveltejs/kit';

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

export const handle: Handle = async ({ event, resolve }) => {
	const sessionToken = event.cookies.get('session');

	const data = await getData.fetch({ variables: { session: sessionToken! }, event });

	event.locals.getSession = () => {
		return data.data?.getUserInformation;
	};
	
	if (event.request.url.includes('/login')) {
		console.log('The request url inclues login');
		return await resolve(event);
	}
	if (event.request.url.includes('/api/auth/callback/google')) {
		console.log('The request url inclues /api/auth/callback/google');
		console.log('Callback');
		return await resolve(event);
	}

	if (!sessionToken) {
		if (!event.request.url.includes('/login')) {
			return Response.redirect('http://localhost:5173/login', 302);
		}
		return await resolve(event);
	}
	setSession(event, { sessionToken });
	const res = await authenticateUser.fetch({
		event
	});
	if (res.data?.authorizeUser) {
		return await resolve(event);
	} else {
		return Response.redirect('http://localhost:5173/login', 302);
	}
};
