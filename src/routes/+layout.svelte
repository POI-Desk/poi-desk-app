<script lang="ts">
	import BottomNav from '$components/BottomNav.svelte';
	import ModalExtendedBooking from '$components/ExtendedBookingComponents/ModalExtendedBooking.svelte';
	import ModalEditDesk from '$components/MapComponents/ModalEditDesk.svelte';
	import ModalPublishMap from '$components/MapComponents/ModalPublishMap.svelte';
	import ModalBooking from '$components/SetBookingComponents/ModalContents/ModalBooking.svelte';
	import ModalEditBooking from '$components/SetBookingComponents/ModalContents/ModalEditBooking.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import { AppShell, Modal, initializeStores, storePopup } from '@skeletonlabs/skeleton';
	import '../app.css';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	initializeStores();

	const modalComponentRegistry: Record<string, ModalComponent> = {
		modalExtendedBooking: {
			ref: ModalExtendedBooking,
			slot: '<p>skeleton</p>'
		},
		modalEditBooking: {
			ref: ModalEditBooking,
			slot: '<p>skeleton</p>'
		},
		modalEditDesk: {
			ref: ModalEditDesk,
			slot: '<p>skeleton</p>'
		},
		modalPublishMap: {
			ref: ModalPublishMap,
			slot: '<p>skeleton</p>'
		}
	};
</script>

<Modal position="items-center !p-0" transitions={true} components={modalComponentRegistry} />
<Toaster richColors={true} />
<AppShell>
	<slot />

	<!-- <svelte:fragment slot="footer">
		<BottomNav />
	</svelte:fragment> -->
</AppShell>
