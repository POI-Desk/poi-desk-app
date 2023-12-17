<script lang="ts">
	import ModalDefaultLocation from '../components/DefaultLocationComponents/ModalContents/ModalDefaultLocation.svelte';
	import ModalBooking from '$components/SetBookingComponents/ModalContents/ModalBooking.svelte';
	import ModalEditBooking from '$components/SetBookingComponents/ModalContents/ModalEditBooking.svelte';
	import '../app.css';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import BottomNav from '$components/BottomNav.svelte';
	import { AppShell, Modal } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import { storePopup } from '@skeletonlabs/skeleton';
	import ModalEditMapObject from '$components/MapComponents/ModalEditMapObject.svelte';

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	initializeStores();

	const modalComponentRegistry: Record<string, ModalComponent> = {
		modalBooking: {
			ref: ModalBooking,
			slot: '<p>skeleton</p>'
			
		},
		modalDefaultLocation: {
			ref: ModalDefaultLocation,
			slot: '<p>skeleton</p>'
		},
		modalEditBooking: {
			ref: ModalEditBooking,
			slot: '<p>skeleton</p>'
		},
    modalEditMapObject: {
      ref: ModalEditMapObject,
      slot: '<p>skeleton</p>'
    }
	};
</script>

<Modal components={modalComponentRegistry} />
<AppShell>
	<slot />
	<svelte:fragment slot="footer">
		<!-- <BottomNav /> -->
	</svelte:fragment>
</AppShell>
