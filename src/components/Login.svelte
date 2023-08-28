<script lang="ts">
	import { graphql } from "$houdini";
    import { user } from "$lib/userStore";

    let userId = '';
    let username = '';
    $: $user.username = username;

    const createOrLoginAsUser = graphql(`
        mutation createOrLoginAsUser(
			$username: String!
		) {
			createOrLoginAsUser(
				username: $username
			) {
			    pk_userid
				username
			}
		}
    `);

    async function loginWithoutMicrosoft() {
        try {
            const result = await createOrLoginAsUser.mutate({
                username: username
            });
            $user.pk_userId = result.data?.createOrLoginAsUser?.pk_userid
        } catch (error) {
            console.error("Error:", error);
        }
    }
</script>

<h1 class="text-center">POI-Desk</h1>

<div class="flex flex-col">
    <div class="p-3">
        <label for="usernameInput" class="label-text">user name</label>
        <input type="text" class="input input-primary" id="usernameInput" bind:value={username}>
    </div>
    <div class="p-3">
        <a href="../" class="btn btn-primary" on:click={loginWithoutMicrosoft}>Login without Microsoft</a>
    </div>
</div>