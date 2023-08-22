<script lang="ts">
	import Confirmation from './ModalContents/Confirmation.svelte';
	import Selection from './ModalContents/Selection.svelte';
	import { createEventDispatcher} from "svelte";

	const dispatch = createEventDispatcher();

	// this function is called when the user clicks on the "Book"/"Cancel" button
	// and closes the Modal by dispatching an event to the parent page setting the 
	// variable showModal to false
	function closeModal() {
		dispatch("close");
	}

	function getTime(event: CustomEvent){
		time = event.detail.timeValue;
		
	}
	let time: string = 'none';
	let modalConfirmVisible: boolean = false;
	let addOutlook: boolean = false; //addOutlook is binded to the checkbox
	export let table: string = 'defaultValue'; //get table from parent page
	export let date: Date = new Date(2022, 12, 2); // get date from parent page
</script>



<!-- useless Modal Stuff -->
<!-- Modal is always set on true and gets spawned when clicking a table on the map -->
<!-- modalConfirmVisible is a check that blends in the confirm page when clicking on "confirmation" -->

<div class="modal" class:modal-open={true}> 
	<div class="modal-box flex flex-col">
		{#if !modalConfirmVisible}
			<Selection {table} {date} bind:addOutlook={addOutlook} on:time={getTime}/>
			<div class="modal-action">
				<button class="btn btn-error" on:click={closeModal}>Cancel</button>
				<button class="btn btn-primary modal-button" on:click={() => (modalConfirmVisible = true)}
					>Confirmation</button
				>
			</div>
		{:else}
			<Confirmation {table} {date} {addOutlook} {time}/>
			<div class="modal-action">
				<button class="btn btn-error" on:click={() => (modalConfirmVisible = false)}>Back</button>
				<button
					class="btn btn-primary modal-button"
					on:click={closeModal}>Book</button>
			</div>
		{/if}

		<!-- TODO: send to server code missing and adding to Outlook? -->
		{#if addOutlook}
			<p>Life is Roblox</p>
		{/if}
	</div>
</div>

<style>
</style>
