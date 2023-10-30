<script lang="ts">
	import { currentBooking, interval } from '$lib/bookingStore';
	import { getModalStore } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();

</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl">
		<input type="text" class="input w1/3 my-3" />
    <input type="text" class="input w1/3 my-3" />
	</div>
{/if}
