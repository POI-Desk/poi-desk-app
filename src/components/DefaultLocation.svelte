<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import { graphql } from '$houdini';

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}
	export let chosenLocation: {pk_locationid: string | null, locationname: string | null};
	
	const defaultLocation = graphql(`
		mutation DefaultLocation($uid: ID!, $lid: ID){
        	setdefaultLocation(userid: $uid, locationid: $lid)
    	}
	`);

	
    function setAsDefault(){
		defaultLocation.mutate({uid: "4ee4a365-2a5f-4830-8f8f-c50733ab7695", lid: chosenLocation.pk_locationid});
		
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
