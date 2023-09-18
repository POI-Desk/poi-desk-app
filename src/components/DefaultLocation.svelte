<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { graphql } from '$houdini';
	import type { Location } from '$lib/types/locationType';
	import { user } from '$lib/userStore';

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}

	$: currentUser = $user;
	let isModalOpen = false;

	export let chosenLocation: Location;
	


	const defaultLocation = graphql(`
		mutation DefaultLocation($uid: ID!, $lid: ID){
        	setdefaultLocation(userid: $uid, locationid: $lid)
    	}
	`);

    async function setAsDefault(){
			await defaultLocation.mutate({uid: currentUser.pk_userId, lid: chosenLocation.pk_locationid});
			closeModal();
    }

</script>
<div class="modal" class:modal-open={true}>
	<div class="modal-box">
		<h1 class="text-2xl">Do you want to set {chosenLocation.locationname} as your default</h1>
		<div class="flex">
			<a class="btn btn-success px-14 justify-self-start"
				
					href="."
					on:click={() => {
						setAsDefault();
					}}>Yes</a
				>
			
			<a class="btn btn-error px-14 justify-self-end"
				href="."
				    >No</a
				>
		</div>
	</div>
</div>

<style>
</style>
