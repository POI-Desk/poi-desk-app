<script lang="ts">
	import { createEventDispatcher } from 'svelte';
  import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { currentBooking } from '$lib/bookingStore';
	import { todaysDate } from "$lib/dateStore";
	import { MapPin, Clock, Building, Building2, MonitorSmartphone } from 'lucide-svelte';


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

	const bookingPropertyClasses: string = "text-xl grid grid-cols-3 items-center align-middle variant-filled-tertiary rounded-full text-center p-2 pl-4"
	const isBookingToday = thisBooking?.date === new Date().toISOString().split("T")[0];
</script>

<div
	class="flex variant-filled-primary rounded-3xl border-box m-3 p-3 shadow-lg"
	class:selected={isBookingToday}
>
	<div class="w-1/3 rounded-lg">
		<img
			class="rounded-3xl w-full h-full"
			src="/locationImages/Wien.png"
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
		<div class="col-span-2 {bookingPropertyClasses}">
			<MapPin />
			{thisBooking?.desk?.floor?.building?.location?.locationname}
		</div>
		<div class="{bookingPropertyClasses}">
			<Building2 />
			{thisBooking?.desk?.floor?.building?.buildingname}
		</div>
		<div class="{bookingPropertyClasses}">
			<Building />
			{thisBooking?.desk?.floor?.floorname}
		</div>
		<div class="{bookingPropertyClasses}">
			<MonitorSmartphone />
			{thisBooking?.desk?.desknum}
		</div>
		<div class="{bookingPropertyClasses}">
			<Clock />
			{(thisBooking?.ismorning ? "07-" : "13-") + (thisBooking?.isafternoon ? "20" : "13")}
		</div>
	</div>
</div>

<style>
	.selected {
		background-color: #8B80F9;
	}
</style>
