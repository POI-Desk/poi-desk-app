<script lang="ts">
    import { addUser } from "$lib/mutations/user"
    
    let newUsername: string = "";
    let saveUserDisabled: boolean = true;
    let newUserClicked: boolean = false;
    let isExtended: boolean = false;
    let isAdmin: boolean = false;
    let isSuperAdmin: boolean = false;
    let password: string;
    let passwordAgain: string;

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
            username: newUsername,
            isExtended,
            isAdmin,
            isSuperAdmin,
            password
        })
        console.log(result.data?.addUser?.pk_userid);
        
    }

</script>

<button class="btn variant-filled-primary" on:click={handleNewUserClick}>+ Add user</button>

{#if newUserClicked}
    <input type="text" class="input input-primary" bind:value={newUsername} on:input={handleInput}>

    <label>
        <input type="checkbox" disabled checked class="disabled:checkbox">
        Is standard user
    </label>
    <label>
        <input type="checkbox" class="checkbox" bind:checked={isExtended}>
        Is extended user
    </label>
    <label>
        <input type="checkbox" class="checkbox" bind:checked={isAdmin}>
        Is admin user
    </label>
    <label>
        <input type="checkbox" class="checkbox" bind:checked={isSuperAdmin}>
        Is super admin user
    </label>

    <input type="password" placeholder="Enter the user's password" bind:value={password}>
    <input type="password" placeholder="Confirm the user's password" bind:value={passwordAgain}>


    <button class="btn variant-filled-secondary" disabled={saveUserDisabled || password !== passwordAgain || !password} on:click={handleSaveUserClick}>Save user</button>

{/if}
