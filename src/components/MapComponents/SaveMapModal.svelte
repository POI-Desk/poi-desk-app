<script lang="ts">
	import { CachePolicy, graphql, type getLocations$result, getAllLocationsStore } from '$houdini';
	import type { QueryResult } from 'houdini';
	import { createEventDispatcher, onMount } from 'svelte';

	export let openModal = false;
	let result: QueryResult<getLocations$result, null>;

	const dispatch = createEventDispatcher();

	onMount(async () => {
		result = await getLocations.fetch({ policy: CachePolicy.NetworkOnly });
	});

	const close = () => {
		dispatch('closeModal');
	};

	const getLocations = graphql(`
		query getLocations {
			getAllLocations {
				locationname
				buildings {
					buildingname
				}
			}
		}
	`);
</script>

<dialog id="my_modal_2" class="modal" class:modal-open={openModal}>
	<form method="dialog" class="modal-box">
		<h3 class="font-bold text-lg">Save Changes!</h3>
		{#if result}
			{#if result.data?.getAllLocations}
				{#each result.data?.getAllLocations as location}
					<div class="form-control">
						<label class="label cursor-pointer">
							<span class="label-text" style="font-weight: 600;">{location?.locationname}</span>
							<input type="radio" name="radio-10" class="radio checked:bg-red-500" checked />
						</label>
					</div>
				{/each}
			{/if}
		{/if}
		<div class="modal-action">
			<!-- if there is a button in form, it will close the modal -->
			<button class="btn variant-filled-primary" on:click={close}>Close</button>
		</div>
	</form>
	<form method="dialog" class="modal-backdrop">
		<button on:click={close}>close</button>
	</form>
</dialog>
