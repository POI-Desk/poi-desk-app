<script lang="ts">
	import ModalExtendedBooking from '$components/ExtendedBookingComponents/ModalExtendedBooking.svelte';
	import ModalEditBooking from '$components/SetBookingComponents/ModalContents/ModalEditBooking.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from '@floating-ui/dom';
	import type { ModalComponent } from '@skeletonlabs/skeleton';
	import { AppShell, Modal, initializeStores, storePopup } from '@skeletonlabs/skeleton';
	import * as Drawer from '$lib/components/ui/drawer';
	import * as Tabs from '$lib/components/ui/tabs';
	import '../app.css';
	let activeSnapPoint = '80px';
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
		}
	};
</script>

<Modal position="items-center !p-0" transitions={true} components={modalComponentRegistry} />
<Toaster richColors={true} />
<AppShell>
	<slot />
</AppShell>

<!-- <Drawer.Root snapPoints={['80px', 0.9]} bind:activeSnapPoint open={true} dismissible={false}>
	<Drawer.Trigger />
	<Drawer.Overlay />
	<Drawer.Portal>
		<Drawer.Content
			class="fixed z-[200] flex flex-col bg-white border border-gray-200 border-b-none rounded-t-[10px] bottom-0 left-0 right-0 h-full max-h-[97%] mx-[-1px]"
		>
			<Tabs.Root value="account" class="w-[400px] flex justify-center mt-10">
				<Tabs.List>
					<Tabs.Trigger value="account">Account</Tabs.Trigger>
					<Tabs.Trigger value="settings">Settings</Tabs.Trigger>
				</Tabs.List>
			</Tabs.Root>
		</Drawer.Content>
	</Drawer.Portal>
</Drawer.Root> -->
