<script lang="ts">
    import { addUser } from "$lib/mutations/user"
    
    let newUsername: string = "";
    let saveUserDisabled: boolean = true;
    let newUserClicked: boolean = false;

    function handleNewUserClick() {
        newUserClicked = true;
    }

    function handleInput() {
        if(newUsername === "") {
            saveUserDisabled = true;
        } else {
            saveUserDisabled = false;
        }
    }
    
    async function handleSaveUserClick() {
        const result = await addUser.mutate({
            username: newUsername})
        console.log(result.data?.addUser?.pk_userid);
    }

</script>

<button class="btn variant-filled-primary" on:click={handleNewUserClick}>+ Add user</button>

{#if newUserClicked}
    <input type="text" class="input input-primary" bind:value={newUsername} on:input={handleInput}>
    <button class="btn variant-filled-secondary" disabled={saveUserDisabled} on:click={handleSaveUserClick}>Save user</button>
{/if}
