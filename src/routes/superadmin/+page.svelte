<script>
	import AddBuilding from "$components/SuperAdminComponents/AddBuilding.svelte";
	import AddLocation from "$components/SuperAdminComponents/AddLocation.svelte";
	import {saveChangesClicked, isSaveDisabled} from "$lib/saveChangesStore"


</script>

<AddLocation />
<AddBuilding />	

<button disabled={$isSaveDisabled} class="btn variant-filled-primary" on:click={$saveChangesClicked = true}
	>Save Changes disabled</button
>

<!-- <LocationList /> -->