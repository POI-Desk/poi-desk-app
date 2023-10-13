<script lang="ts">
	//amongus
	import { CachePolicy } from '$houdini';
	import CrazyAnimation from '$components/CrazyAnimation.svelte';
	import Check from '$components/Check.svelte';
	import FloorSelection from '$components/FloorSelection.svelte';
	import BuildingSelection from '$components/BuildingSelection.svelte';
	import { getModalStore, type ModalSettings } from '@skeletonlabs/skeleton';
	import { floorid } from '$lib/floorStore';
	import { dateValue } from '$lib/dateStore';
	import { selectedDesk } from '$lib/bookingStore';
	import { getDesks } from "$lib/queries/deskQueries";

	const modalStore = getModalStore();

	const modal : ModalSettings = {
		type: 'component',
		component: 'modalBooking'
	}


	let visible: boolean;

	function confirmBooking() {
		visible = true;
		setTimeout(() => {
			visible = false;
		}, 500);
	}
</script>

<div class="grid grid-rows-2">
    <FloorSelection/>

	<div class="grid grid-cols-5 gap-2">
		{#await getDesks.fetch({ variables: { floorid: $floorid } })}
			<p>loading desks...</p>
		{:then fetched}
			{#each fetched?.data?.getDesksOnFloor ?? [] as desk}
				<button
					on:click={() => {
						$selectedDesk = desk;
						modalStore.trigger(modal);
					}}
					class="btn variant-filled-success"
					class:variant-filled-error={desk?.bookings?.find((b) => b?.date === $dateValue)}
					>{desk?.desknum}</button
				>
			{/each}
		{/await}
	</div>
</div>

<!--
{#if showModal}
	<Booking
		date={new Date($dateValue)}
		desk={$selectedDesk}
		on:close={() => {
			toggleModal(null);
			getDesks.fetch({ policy: CachePolicy.NetworkOnly });
		}}
		on:play={confirm}
	/>
{/if}
-->

{#if visible}
    <CrazyAnimation>
        <Check/>
    </CrazyAnimation>
{/if}

<div class="flex justify-center">
    <div class="absolute bottom-20">
        <BuildingSelection/>
    </div>
</div>
