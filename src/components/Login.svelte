<script lang="ts">
	import { graphql } from '$houdini';
	import { user } from '$lib/userStore';
	import { goto } from '$app/navigation';

	const createOrLoginAsUser = graphql(`
		mutation createOrLoginAsUser($username: String!) {
			createOrLoginAsUser(username: $username) {
				pk_userid
				username
				location {
					pk_locationid
					locationname
				}
			}
		}
	`);

	let path: string = '/location';
	let username: string = '';

	async function loginWithoutMicrosoft() {
		try {
			const result = await createOrLoginAsUser.mutate({
				username: username
			});
			$user = { ...result.data?.createOrLoginAsUser! };
			path = $user.location == null ? '/location' : '/';
			goto(path);
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>
<h1
	class="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h1 text-primary-500"
>
	POI-Desk
</h1>

<div class="h-screen flex flex-col items-center justify-center">
	<div class="p-3">
		<!--        <label for="usernameInput" class="label-text">user name</label>-->
		<!--
		<input
			type="text"
			placeholder="Enter your username"
			class="input input-primary"
			id="usernameInput"
			bind:value={username}
		/>
		-->
	</div>
	<div class="p-3">
		<!--
		<button class="btn variant-filled-primary p-3" on:click={loginWithoutMicrosoft}>
			<a href="../" class="pl-5 pr-5"> Login</a>
		</button>
		-->
		<form method="post">
			<button class="gsi-material-button">
				<div class="gsi-material-button-state" />
				<div class="gsi-material-button-content-wrapper">
					<div class="gsi-material-button-icon">
						<svg
							version="1.1"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 48 48"
							xmlns:xlink="http://www.w3.org/1999/xlink"
							style="display: block;"
						>
							<path
								fill="#EA4335"
								d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
							/>
							<path
								fill="#4285F4"
								d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
							/>
							<path
								fill="#FBBC05"
								d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
							/>
							<path
								fill="#34A853"
								d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
							/>
							<path fill="none" d="M0 0h48v48H0z" />
						</svg>
					</div>
					<span class="gsi-material-button-contents">Sign in with Google</span>
					<span style="display: none;">Sign in with Google</span>
				</div>
			</button>
		</form>
	</div>
</div>
