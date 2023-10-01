<script lang="ts">
	import { graphql } from '$houdini';
	import { user } from '$lib/userStore';

	let username = '';
	let pk_userId: string = '';
	$: $user.username = username;
	$: $user.pk_userid = pk_userId;

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

	async function loginWithoutMicrosoft() {
		try {
			const result = await createOrLoginAsUser.mutate({
				username: username
			});
			$user = result.data?.createOrLoginAsUser!;
			window.location.href = $user.location == null ? '../location' : '..';
			console.log($user, $user.location == null, $user.location == null ? '../location' : '..')
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>

<h1 class="text-center">POI-Desk</h1>

<div class="flex flex-col">
	<div class="p-3">
		<label for="usernameInput" class="label-text">user name</label>
		<input type="text" class="input input-primary" id="usernameInput" bind:value={username} />
	</div>
	<div class="p-3">
		<button class="btn variant-filled-primary p-3" on:click={loginWithoutMicrosoft}>
			<!--<a href="{$user.location == null ? '../location' : '..'}">-->Login without Microsoft<!--</a>-->
		</button>
	</div>
</div>