<script lang="ts">
	import { graphql } from '$houdini';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('close');
	}
	let isModalOpen: boolean = false;
	export let chosenLocation: {pk_locationid: string | null, locationname: string | null};

    function setAsDefault(){
        console.log('hi')
    }

</script>
<div class="modal" class:modal-open={true}>
	<div class="modal-box">
		<h1 class="text-2xl">Do you want to set {chosenLocation.locationname} as your default</h1>
		<div class="flex">
			<button class="btn btn-success px-14 justify-self-start">
				<a
					href="."
					on:click={() => {
						setAsDefault();
					}}>Yes</a
				></button
			>
			<button class="btn btn-error px-14 justify-self-end"
				><a
					href="."
				    >No</a
				></button
			>
		</div>
	</div>
</div>

<style>
</style>
