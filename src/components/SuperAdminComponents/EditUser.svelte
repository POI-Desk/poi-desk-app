<script lang="ts">
	import { resetPassword } from '$lib/mutations/user';
	import type { User } from '$lib/types/userTypes';

	export let userToEdit: User;

	let newPassword: string;
	let showChangePassword: boolean = false;

	async function saveUser() {

        /**
         * save password changes
        */
		if (newPassword) {
			const passwordResult = await resetPassword
				.mutate({
					userid: userToEdit.pk_userid,
					newPassword
				})
				.then((value) => console.log(value));
		}
	}
</script>

{#if userToEdit}
	<button class="btn variant-filled-primary" on:click={() => (showChangePassword = true)}
		>Change password</button
	>

	{#if showChangePassword}
		<input class="input" bind:value={newPassword} />
	{/if}
	<button class="btn variant-filled-primary" on:click={saveUser}>Save</button>
{/if}
