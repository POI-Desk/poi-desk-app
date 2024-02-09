<script lang="ts">
	import { createEventDispatcher } from 'svelte';
  import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { currentBooking } from '$lib/bookingStore';
	import { todaysDate } from "$lib/dateStore";


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

	const bookingPropertyClasses: string = "text-xl variant-filled-tertiary rounded-full text-center p-1"
	const isBookingToday = thisBooking?.date === todaysDate.toISOString().split("T")[0];

</script>

<div
	class="flex variant-filled-primary rounded-3xl border-box m-3 p-3 shadow-lg"
	class:selected={isBookingToday}
>
	<div class="w-1/3 rounded-lg">
		<img
			class="rounded-3xl w-full h-full"
			src="https://media.istockphoto.com/id/1322277517/photo/wild-grass-in-the-mountains-at-sunset.jpg?s=612x612&w=0&k=20&c=6mItwwFFGqKNKEAzv0mv6TaxhLN3zSE43bWmFN--J5w="
			alt=""
			srcset=""
		/>
	</div>

	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div on:click={toggleModal} class="grid grid-cols-2 gap-2.5 w-2/3 bg-white rounded-3xl ml-3 p-3 text-gray-700">
		<div class="text-2xl col-span-2 font-bold text-center">
			{#if (isBookingToday)}
				Today
			{:else }
				{thisBooking?.date}
			{/if}
		</div>
		<div class="text-xl col-span-2 variant-filled-tertiary rounded-full text-center p-1">
			<i class="fa fa-id-badge" aria-hidden="true" />
			{thisBooking?.desk?.floor?.building?.location?.locationname}
		</div>
		<div class="{bookingPropertyClasses}">
			<i class="fa fa-id-badge" aria-hidden="true" />
			{thisBooking?.desk?.floor?.building?.buildingname}
		</div>
		<div class="{bookingPropertyClasses}">
			<i class="fa fa-id-badge" aria-hidden="true" />
			{thisBooking?.desk?.floor?.building?.location?.locationname}
		</div>
		<div class="{bookingPropertyClasses}">
			<i class="fa fa-id-badge" aria-hidden="true" />
			{thisBooking?.desk?.floor?.floorname}
		</div>
		<div class="{bookingPropertyClasses}">
			<i class="fa fa-id-badge" aria-hidden="true" />
			{thisBooking?.desk?.desknum}
		</div>
	</div>
</div>

<style>
	.selected {
		background-color: #8B80F9;
	}
</style>
