<script lang="ts">
	import { Autocomplete, popup } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption, PopupSettings } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	export let names: string[];
	let inputDemo = '';
	function onFlavorSelection(event: CustomEvent<AutocompleteOption<string>>): void {
		inputDemo = event.detail.label;
		dispatch('selected', event.detail.label);
	}

	let popupSettings: PopupSettings = {
		event: 'focus-click',
		target: 'popupAutocomplete',
		placement: 'bottom'
	};
</script>

<div
	class="flex flex-col absolute w-1/5 top-11 left-1/2 z-[100] -translate-x-1/2 rounded-full"
>
	<input
		type="search"
		class="w-full border-2 border-primary-300 shadow-[0px_0px_75px_1px_rgba(0,0,0,0.1)] rounded-full bg-surface-50 text-primary-500 placeholder-primary-500 font-semibold"
		placeholder="Search the map..."
		bind:value={inputDemo}
		use:popup={popupSettings}
	/>
	<div
		class="card w-full max-w-sm max-h-48 p-4 overflow-y-auto"
		tabindex="-1"
		data-popup="popupAutocomplete"
	>
		<Autocomplete
			bind:input={inputDemo}
			options={names.map((name) => ({ label: name, value: name }))}
			on:selection={onFlavorSelection}
		/>
	</div>
</div>
