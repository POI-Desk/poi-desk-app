<script lang="ts">
	import ModalDefaultLocation from './../components/ModalContents/ModalDefaultLocation.svelte';
	import ModalBooking from '$components/ModalContents/ModalBooking.svelte';
	import '../app.css';
	import BottomNav from '$components/BottomNav.svelte';
	import { AppShell, Modal } from '@skeletonlabs/skeleton';
	import { initializeStores } from '@skeletonlabs/skeleton';
	import type { ModalComponent } from '@skeletonlabs/skeleton';

	initializeStores();
	const modalComponentRegistry: Record<string, ModalComponent> = {
		modalBooking: {
			ref: ModalBooking,
			slot: '<p>skeleton</p>'
		},
		modalDefaultLocation:{
			ref: ModalDefaultLocation,
			slot: '<p>skeleton</p>'
		}
	};
</script>

<Modal components="{modalComponentRegistry}" />
<AppShell>
	<slot />
	<svelte:fragment slot="footer">
		<BottomNav />
	</svelte:fragment>
</AppShell>
