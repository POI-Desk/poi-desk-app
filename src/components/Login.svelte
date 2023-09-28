<script lang="ts">
	import { graphql } from '$houdini';
	import { user } from '$lib/userStore';
	import { location } from '$lib/locationStore';
	import type { Location } from '$lib/types/locationType';

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

	let hasDefaultLocatione: boolean = false;
	export const _hasDefaultLocationVariables = () => {
		if ($user.pk_userid) return { uid: $user.pk_userid };
	};

	let tempLocation: Location;
	$: $location = tempLocation;

	async function checkLocation() {
		let loc: Location | null = $user.location;
		if (loc) {
			$location = {
				locationname: loc.locationname!,
				pk_locationid: loc.pk_locationid!
			};
			hasDefaultLocatione = true;
		}
		console.log(loc, hasDefaultLocatione, $location);
	}

	async function loginWithoutMicrosoft() {
		try {
			const result = await createOrLoginAsUser.mutate({
				username: username
			});
			$user.pk_userid = result.data?.createOrLoginAsUser?.pk_userid!;
			await checkLocation();
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
		<a class="btn variant-filled-primary" on:click={loginWithoutMicrosoft}>
			<a href="../{hasDefaultLocatione ? '' : 'location'}">Login without Microsoft</a></a
		>
	</div>
</div>
