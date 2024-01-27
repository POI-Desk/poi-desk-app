<script lang="ts">
	import ModalDefaultLocation from '../components/DefaultLocationComponents/ModalContents/ModalDefaultLocation.svelte';
	import ModalBooking from '$components/SetBookingComponents/ModalContents/ModalBooking.svelte';
	import ModalEditBooking from '$components/SetBookingComponents/ModalContents/ModalEditBooking.svelte';
	import '../app.css';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import BottomNav from '$components/BottomNav.svelte';
	import { AppShell, Modal, Toast } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import ModalExtendedBooking from "$components/ExtendedBookingComponents/ModalExtendedBooking.svelte";
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	initializeStores();

	const modalComponentRegistry: Record<string, ModalComponent> = {
		modalBooking: {
			ref: ModalBooking,
			slot: '<p>skeleton</p>'
		},
		modalExtendedBooking: {
			ref: ModalExtendedBooking,
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
	};
</script>

<Modal components={modalComponentRegistry} />
<Toast zIndex="z-[1000]"/>
<AppShell>
	<slot />
	<svelte:fragment slot="footer">
<!--		 <BottomNav />-->
	</svelte:fragment>
</AppShell>
