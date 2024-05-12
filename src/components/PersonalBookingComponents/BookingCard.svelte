<script lang="ts">
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { currentBooking } from '$lib/bookingStore';
	import { MapPin, Clock, Building, MonitorSmartphone, Cuboid, Check } from 'lucide-svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import ModalEditBooking from '$components/SetBookingComponents/ModalContents/ModalEditBooking.svelte';

	export let thisBooking: any;

	const modalStore = getModalStore();

	const modal: ModalSettings = {
		type: 'component',
		component: 'modalEditBooking'
	};

	async function toggleModal() {
		$currentBooking = thisBooking;
	}

	const bookingPropertyClasses: string =
		'text-base grid grid-cols-3 items-center align-middle variant-filled-tertiary rounded-full text-center py-1 pl-3';
	const isBookingToday = thisBooking?.date === new Date().toISOString().split('T')[0];
</script>

<Drawer.NestedRoot>
	<Drawer.Trigger>
		<button
			class="flex variant-filled-primary rounded-3xl border-box m-3 p-3 shadow-lg"
			class:selected={isBookingToday}
			on:click={async () => {
				await toggleModal();
			}}
		>
			<!--	TODO dynamisch bild auswaehlen-->
			<div class="w-1/3 rounded-lg">
				<img
					class="rounded-3xl w-full h-full object-cover"
					src="/locationImages/Wien.png"
					alt=""
					srcset=""
				/>
			</div>
			<div
				class="bg-slate-50 grid grid-cols-2 gap-2 gap-x-0.5 w-2/3 rounded-3xl ml-3 p-2 text-gray-700"
			>
				<div class="text-xl text-surface-900-50-token col-span-2 font-bold text-center">
					{#if isBookingToday}
						Today
					{:else}
						{thisBooking?.date}
					{/if}
				</div>
				<div class="col-span-2 {bookingPropertyClasses}">
					<MapPin />
					{thisBooking?.desk?.map?.floor?.building?.location?.locationname}
				</div>
				<div class={bookingPropertyClasses}>
					<Building />
					{thisBooking?.desk?.map?.floor?.building?.buildingname}
				</div>
				<div class={bookingPropertyClasses}>
					<Cuboid />
					{thisBooking?.desk?.map?.floor?.floorname}
				</div>
				<div class={bookingPropertyClasses}>
					<MonitorSmartphone />
					{thisBooking?.desk?.desknum}
				</div>
				<div class={bookingPropertyClasses}>
					<Clock />
					{(thisBooking?.ismorning ? '07-' : '13-') + (thisBooking?.isafternoon ? '20' : '13')}
				</div>
			</div>
		</button>
	</Drawer.Trigger>
	<Drawer.Content class="z-[2000] h-full !max-h-[94%]">
		<ModalEditBooking>
			<Drawer.Close slot="confirmDeletion">
				<Check />
			</Drawer.Close>
			<Drawer.Close slot="save">Save changes</Drawer.Close>
		</ModalEditBooking>
	</Drawer.Content>
</Drawer.NestedRoot>

<style>
	.selected {
		background-color: #8b80f9;
	}
</style>
