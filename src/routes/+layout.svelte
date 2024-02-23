<script lang="ts">
	import ModalDefaultLocation from '../components/DefaultLocationComponents/ModalContents/ModalDefaultLocation.svelte';
	import ModalBooking from '$components/SetBookingComponents/ModalContents/ModalBooking.svelte';
	import ModalEditBooking from '$components/SetBookingComponents/ModalContents/ModalEditBooking.svelte';
	import ModalChangeDefaultLocation from '$components/UserPageComponents/ModalChangeDefaultLocation.svelte';
	import '../app.css';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import BottomNav from '$components/BottomNav.svelte';
	import { AppShell, Modal, Toast } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import ModalExtendedBooking from "$components/ExtendedBookingComponents/ModalExtendedBooking.svelte";
	import { storePopup } from '@skeletonlabs/skeleton';
	import { goto } from "$app/navigation";
	import { MapPin, Search } from "lucide-svelte";
	import SearchBar from "$components/SearchBar.svelte";
	import DateSelection from "$components/DateSelection.svelte";
	
	import ModalEditDesk from '$components/MapComponents/ModalEditDesk.svelte';
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
		modalChangeDefaultLocation: {
			ref: ModalChangeDefaultLocation,
			slot: '<p>skeleton</p>'
		},
		modalEditDesk: {
			ref: ModalEditDesk,
			slot: '<p>skeleton</p>'
		}
		/*
    modalEditMapObject: {
      ref: ModalEditMapObject,
      slot: '<p>skeleton</p>'
    }
		*/
	};
</script>

<Modal position="items-center !p-0" transitions={true} components={modalComponentRegistry} />
<Toast 	zIndex="z-[1000]"/> 
<AppShell>
	<slot />

	<svelte:fragment slot="footer">
		 <BottomNav />
	</svelte:fragment>
</AppShell>
