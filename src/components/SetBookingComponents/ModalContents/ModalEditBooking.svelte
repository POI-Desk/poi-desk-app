<script lang="ts">
	import { currentBooking } from '$lib/bookingStore';
	import { getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

	console.log($currentBooking);

</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl">
		
	</div>
{/if}
