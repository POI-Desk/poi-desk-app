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
		$user = {...result.data?.createOrLoginAsUser! };
		path = $user.location == null ? '/location' : '/';
		goto(path);
		} catch (error) {
			console.error('Error:', error);
		}
	}
</script>


<h1 class="absolute top-20 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h1 text-primary-500-400-token">POI-Desk</h1>

<div class="h-screen flex flex-col items-center justify-center">
        <div class="p-3">
<!--        <label for="usernameInput" class="label-text">user name</label>-->
        <input type="text" placeholder="Enter your username" class="input input-primary" id="usernameInput" bind:value={username}/>
    </div>
    <div class="p-3">
        <button class="btn variant-filled-primary p-3" on:click={loginWithoutMicrosoft}>
            <a href="../" class="pl-5 pr-5">Login</a>
        </button>
    </div>
</div>