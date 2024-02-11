<script lang="ts">
	import { allMapObjects, selectedMapObject } from '$lib/stores/mapObjectStore';
	import type { MapObject } from '$lib/types/mapObjectTypes';
	import { RadioGroup, RadioItem, getModalStore } from '@skeletonlabs/skeleton';
	import { SvelteComponent, createEventDispatcher, onMount } from 'svelte';

	const cBase = 'card p-4 w-1/5 shadow-xl space-y-4';

	const dispatch = createEventDispatcher();

	const modalStore = getModalStore();

	const saveModal = () => {
		modalStore.close();

	};

	const cancelModal = () => {
		modalStore.close();
	};

</script>

{#if $modalStore[0]}
	<div class="{cBase} rounded-xl shadow-3xl flex flex-col items-center">
		<div class="flex flex-col items-center space-y-2 w-full">
			<h1 class="text-4xl font-semibold text-primary-500">{$selectedMapObject?.id}</h1>
			<p class="text-primary-500" >select an employee for the desk</p>
			<input type="text" class="input w-full xl:w-3/4" placeholder="search employee..." >
			<div class="flex flex-row space-x-2 justify-end w-full">
				<button
					class="btn border-2 border-primary-500 w-20"
					on:click={cancelModal}>
					Cancel
				</button>
				<button
					class="btn bg-primary-500 w-20" 
					on:click={saveModal}>
					Save
				</button>
			</div>
		</div>
	</div>
{/if}
