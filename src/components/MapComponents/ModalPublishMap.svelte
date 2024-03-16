<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		SlideToggle,
		getModalStore,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import { toast } from 'svelte-sonner';

	const modalStore = getModalStore();

	const cBase = 'card px-8 py-4 shadow-xl space-y-4 w-1/3';
	let keep: boolean = false;
	let bookings: boolean = true;

	let warningSeen: boolean = false;

	const toolTip: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'bottom'
	};


	const publish = () => {
		if ($modalStore[0].response) {
			$modalStore[0].response({ keepPublishedMap: keep, keepBookings: bookings });
		}
		modalStore.close();
	};

	const bookingsChanged = () => {
		if (bookings) {
			return;
		}
		if (!warningSeen) {
			toast.warning('All bookings on the map will be deleted. Are you sure?', {
				position: 'bottom-center'
			});
			warningSeen = !warningSeen;
		}
	};
</script>

{#if $modalStore[0]}
	<div class="{cBase} rounded-xl shadow-3xl flex flex-col items-center">
		<h1 class="text-2xl font-semibold text-primary-500">Publish Settings</h1>
		<div class="flex flex-col w-full space-y-4">
			<SlideToggle class="select-none text-primary-500" name="slider-label" bind:checked={keep}>
				{keep ? 'keep' : "don't keep"} map
			</SlideToggle>
			<SlideToggle
				class="select-none text-primary-500"
				name="slider-label"
				bind:checked={bookings}
				on:change={bookingsChanged}
			>
				remove {bookings ? ' necessary ' : ' all '} bookings
			</SlideToggle>
		</div>
		<div class="flex justify-end space-x-2 w-full">
			<Button
				class="btn variant-outline-primary"
				on:click={() => {
					modalStore.close();
				}}>Cancel</Button
			>
			<Button class="btn variant-filled-primary" on:click={publish}>Publish</Button>
		</div>
	</div>
{/if}
