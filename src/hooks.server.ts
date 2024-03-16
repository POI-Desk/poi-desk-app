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
	event.cookies.set(
		'session',
		'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InRpc2NobGVyLmRldkBnbWFpbC5jb20iLCJuYW1lIjoiVG9iaWFzIFRpc2NobGVyIiwidXNlcm5hbWUiOiJ0aXNjaGxlci5kZXYiLCJsb2NhdGlvbiI6IldpZW4iLCJwaWN0dXJlIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSzA2aHFoVFpJZjV5Ml9PNnYtcHBSajVpOGZkcjFnb3NjcDltM1dGSk9JMlE9czk2LWMiLCJzdWIiOiIxMTYwMDg3MDI3NjM3MTIwMzAxMDAiLCJpc3MiOiJQT0lEZXNrIiwiYXVkIjoiUE9JRGVzayIsImlhdCI6MTcxMDMxMjQ5MCwiZXhwIjoxNzEwOTE3MjkwfQ.2KwjeW6dioXUMf4Ie5v61HAjAcoXQxw7QGiYo2bKCS0'
	);
	const sessionToken = event.cookies.get('session');
	
	const data = await getData.fetch({ variables: { session: sessionToken! }, event});
	
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
		console.log('No session token found');
		if (!event.request.url.includes('/login')) {
			return Response.redirect('http://localhost:5173/login', 302);
		}
		return await resolve(event);
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
