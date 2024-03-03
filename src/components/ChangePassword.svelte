<script lang="ts">
    import { changePassword } from "$lib/mutations/user";
    import { user } from '$lib/userStore';

    let oldPassword: string;
    let newPassword: string;
    let newPasswordAgain: string;

    async function handleChangePassword() {
        const result = await changePassword
			.mutate({
				userid: $user.pk_userid,
                oldPassword,
                newPassword
			})
			.then((value) => {
				if (value.data?.changePassword === null) {
                    alert("You entered the wrong password or tried to set your password to the same it was before or didn't enter a new password");
                }
                
			});
    }

</script>

<h2>Change Password</h2>

<input type="password" class="input" bind:value={oldPassword} placeholder="Enter old password">
<input type="password" class="input" bind:value={newPassword} placeholder="Enter new password">
<input type="password" class="input" bind:value={newPasswordAgain} placeholder="Confirm new password">
<button class="btn variant-filled-primary" disabled={newPassword !== newPasswordAgain || !newPassword} on:click={handleChangePassword}>Save</button>