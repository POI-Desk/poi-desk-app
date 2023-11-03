<script lang="ts">
	import { allMapObjects, selectedMapObject } from '$lib/stores/mapObjectStore';
	import { RadioGroup, RadioItem, getModalStore } from '@skeletonlabs/skeleton';
	import { SvelteComponent, createEventDispatcher } from 'svelte';

	const cBase = 'card p-4 w-1/4 shadow-xl space-y-4';
	let generateId: boolean = false;
	let radioSelected: number = 0;
	let availableId: boolean = generateId;
	let newId: string = '';

	const dispatch = createEventDispatcher();

	const modalStore = getModalStore();

	const saveModal = () => {
		if (!availableId) return;
		let oldId: string = $selectedMapObject!.id;
		if ($modalStore[0].response) $modalStore[0].response({ newId, oldId });
		modalStore.close();
	};

	const cancelModal = () => {
		modalStore.close();
	};

	const genRandomId = (length: number) => {
		const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		console.log(characters.length);
		const charactersLength = characters.length;
		let result: string;
		do {
			result = '';
			for (let i = 0; i < length; i++) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}
		} while ($allMapObjects.find((obj) => obj.id === result) != null);
		return result;
	};

	$: {
		if (generateId) newId = genRandomId(5);
		checkForID();
	}

	const checkForID = () => {
		availableId = true;
		if (generateId) return;
		if (newId.length === 0) {
			availableId = false;
			return;
		}
		$allMapObjects.map((obj) => {
			if (obj.id === newId) {
				availableId = false;
			}
		});
	};
</script>

{#if $modalStore[0]}
	<div class="{cBase} rounded-xl shadow-3xl flex flex-col items-center">
		<div class="flex flex-col items-center space-y-2 w-full">
			<label class="flex flex-row items-center space-x-1">
				<input
					type="checkbox"
					class="w-5 h-5 border-2 border-[#CCC5B9]"
					bind:checked={generateId}
				/>
				<p class="select-none">Autogenerate ID</p>
			</label>
			<input
				type="text"
				disabled={generateId}
				maxlength="5"
				class="w-1/2 border-2 border-[{availableId
					? '#CCC5B9'
					: '#DF3B57'}] rounded-full opacity-{generateId ? 75 : 100}"
				on:keyup={checkForID}
				bind:value={newId}
			/>
		</div>
		<div>
			<RadioGroup
				rounded="rounded-full"
				active="variant-filled-primary"
				hover="hover:variant-soft-primary"
			>
				<RadioItem bind:group={radioSelected} name="justify" value={0}>Shared</RadioItem>
				<RadioItem bind:group={radioSelected} name="justify" value={1}>Fixed</RadioItem>
			</RadioGroup>
		</div>
		<div class="flex justify-center w-full">
			<button class="btn variant-filled-error rounded-full" on:click={cancelModal}>Cancel</button>
			<button
				class="btn variant-filled-primary rounded-full ml-2"
				disabled={!availableId}
				on:click={saveModal}>Save</button
			>
		</div>
	</div>
{/if}
