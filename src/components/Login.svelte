<script lang="ts">
	import { graphql } from '$houdini';
	import { user } from '$lib/userStore';
	import { location } from '$lib/locationStore';
	import type { Location } from '$lib/types/locationType';

	let username = '';
	let pk_userId: string = '';
	$: $user.username = username;
	$: $user.pk_userId = pk_userId;

	const createOrLoginAsUser = graphql(`
		mutation createOrLoginAsUser($username: String!) {
			createOrLoginAsUser(username: $username) {
				pk_userid
				username
			}
		}
	`);


	let hasDefaultLocatione: boolean = false;
	export const _hasDefaultLocationVariables = () => {
		if ($user.pk_userId)
			return { uid: $user.pk_userId };
	};
	const checkIfDefaultLocation = graphql(`
		query hasDefaultLocation($uid: ID) {
			hasDefaultLocation(id: $uid){
				locationname
				pk_locationid
			}
		}
	`);
	let tempLocation: Location;
	$: $location = tempLocation;

	async function checkLocation() {
		//checkIfDefaultLocation.fetch({uid: $user.pk_userId})
		let loc = await $checkIfDefaultLocation.data?.hasDefaultLocation;
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
			$user.pk_userId = result.data?.createOrLoginAsUser?.pk_userid!;
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
		<a
			class="btn btn-primary"
			on:click={loginWithoutMicrosoft}>
			<a href="../{hasDefaultLocatione ? '' : 'location'}">Login without Microsoft</a></a
		>
	</div>
</div>
