<script lang="ts">
    import EditUser from '$components/SuperAdminComponents/EditUser.svelte';
    import SearchBar from '$components/SearchBar.svelte';
	import type { User } from '$lib/types/userTypes';

    let userToEdit: User;

    function handleUserClicked(event) {
        userToEdit = event.detail;
    }
</script>

<p>Select a user to edit</p>

<SearchBar showUsrInfo={false} on:clicked={handleUserClicked} />


<EditUser userToEdit={userToEdit} />