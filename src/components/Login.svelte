<script lang="ts">

	import { goto } from '$app/navigation';
	import { graphql } from '$houdini';
	import { user } from '$lib/userStore';


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

	async function loginWithoutMicrosoft(){
		try {
			const result = await createOrLoginAsUser.mutate({
				username: username
		});
		$user = {...result.data?.createOrLoginAsUser!, userInfo: '' };
		path = $user.location == null ? '/location' : '/';
		goto(path);
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>

<h1 class="text-center">POI-Desk</h1>

<div class="flex flex-col">
    <div class="p-3">
        <label for="usernameInput" class="label-text">user name</label>
        <input type="text" class="input input-primary" id="usernameInput" bind:value={username}/>
    </div>
    <div class="p-3">
        <button class="btn variant-filled-primary p-3" on:click={loginWithoutMicrosoft}>
            <a href="../"> Login without Microsoft </a>
        </button>
    </div>
</div>