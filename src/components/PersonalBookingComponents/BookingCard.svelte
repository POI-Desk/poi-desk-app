<script lang="ts">
	import { createEventDispatcher } from 'svelte';
  import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { currentBooking } from '$lib/bookingStore';


	const dispatch = createEventDispatcher();

	function deleteBooking(id: string) {
		dispatch('deleteBooking', id);
	}

	export let thisBooking: any;


	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'component',
		component: 'modalEditBooking'
	};

  function toggleModal() {
		$currentBooking = thisBooking;
    modalStore.trigger(modal);
  }

</script>

<div class="flex bg-slate-500 rounded-lg border-box m-3">
	<div class="w-1/3 rounded-lg">
		<img
			class="rounded-lg w-full h-full"
			src="https://media.istockphoto.com/id/1322277517/photo/wild-grass-in-the-mountains-at-sunset.jpg?s=612x612&w=0&k=20&c=6mItwwFFGqKNKEAzv0mv6TaxhLN3zSE43bWmFN--J5w="
			alt=""
			srcset=""
		/>
	</div>

	<div class="w-2/3 rounded-lg ml-3 my-3">
		<h1 class="text-xl">
			{thisBooking?.pk_bookingid}
		</h1>
		<h1 class="text-xl">
			<i class="fa fa-id-badge" aria-hidden="true" />
			{thisBooking?.bookingnumber}
		</h1>
		<h1 class="text-xl">
			<i class="fa fa-calendar" aria-hidden="true" />
			{thisBooking?.date}
		</h1>
		<button
			on:click={() => deleteBooking(thisBooking?.pk_bookingid ?? 'lol du stinkst')}
			class="btn variant-filled-error btn-sm btn-outline">Delete</button
		>
		<button on:click={toggleModal} class="btn variant-filled-primary btn-sm btn-outline"
			>Edit</button
		>
	</div>
</div>

<style>
</style>
