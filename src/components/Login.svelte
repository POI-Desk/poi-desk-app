<script lang="ts">
	import { graphql } from "$houdini";
    import { user } from "$lib/userStore";
     
    let username = '';
    $: $user.username = username;

    const createOrLoginAsUser = graphql(`
        mutation createOrLoginAsUser(
			$username: String!
		) {
			createOrLoginAsUser(
				username: $username
			) {
				username
			}
		}
    `);


</script>

<h1 class="text-center">POI-Desk</h1>

<div class="flex flex-col">
    <div class="p-3">
        <label for="usernameInput" class="label-text">user name</label>
        <input type="text" class="input input-primary" id="usernameInput" bind:value={username}>
    </div>
    <div class="p-3">
        <a href="../" class="btn btn-primary" on:click={() => {
            createOrLoginAsUser.mutate({
                username: username
            })
        }}>Login without Microsoft</a>
    </div>
</div>