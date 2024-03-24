<script lang="ts">
	import type { AutocompleteOption, PopupSettings } from '@skeletonlabs/skeleton';
	import { Autocomplete, popup } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';
	import * as Command from '$lib/components/ui/command';
	const dispatch = createEventDispatcher();

	export let values: { label: string; value: string }[];
	let inputDemo = '';
	let open = false;
	function onFlavorSelection(event: CustomEvent<AutocompleteOption<string>>): void {
		console.log(event.detail);
		inputDemo = event.detail.label;
		dispatch('selected', event.detail.value);
	}

	let popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom'
	};
</script>

<div class="flex flex-col absolute w-1/5 top-11 left-1/2 z-[100] -translate-x-1/2 rounded-full">
	<input
		type="search"
		class="w-full border-2 border-primary-300 shadow-around-10 rounded-full bg-surface-50 text-primary-500 placeholder-primary-500 font-semibold"
		placeholder="Search the map..."
		bind:value={inputDemo}
		use:popup={popupSettings}
	/>
	<div
		class="card w-full max-w-sm max-h-36 p-4 overflow-y-auto"
		tabindex="-1"
		data-popup="popupAutocomplete"
	>
		<Autocomplete
			bind:input={inputDemo}
			transitionInParams={{ duration: 400 }}
			transitionOutParams={{ duration: 400 }}
			options={[...values]}
			on:selection={onFlavorSelection}
		/>
	</div>
</div>
