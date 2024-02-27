import { page } from '$app/stores';
import { authenticateUser } from '$lib/queries/userQuerries';
import type { Handle } from '@sveltejs/kit';
import { setSession } from '$houdini';


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

	event.locals.getSession = () => {
		return sessionToken ?? 'Amongus';
	};
	
  if (event.request.url.includes('/login')) {
    return response;
  }
  if (event.request.url.includes('/api/auth/callback/google')){
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
	setSession(event, {sessionToken});
	console.log("Session token found:", sessionToken);
	const res = await authenticateUser.fetch({
		event
	});
  console.log("AuthenticateUser response:", res.data?.authorizeUser);
  if (res.data?.authorizeUser) {
    return await resolve(event);
  }
  else{
    return Response.redirect('http://localhost:5173/login', 302);
  }
};

