<script lang="ts">
	import { CachePolicy, graphql } from '$houdini';
	import { editedMapId } from '$lib/stores/mapCreationStore';
	import { allMapObjects, selectedMapObject } from '$lib/stores/mapObjectStore';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { createEventDispatcher } from 'svelte';

	const cBase = 'card p-4 w-1/5 shadow-xl space-y-4';

	const dispatch = createEventDispatcher();

	const modalStore = getModalStore();

	const getUser = graphql(`
		query getUser($id: ID!) {
			getUserById(id: $id) {
				username
			}
		}
	`);

	const usersWithNoDeskOnMap = graphql(`
		query getUsersWithNoDeskOnMap($mapId: ID!) {
			getUsersWithNoDeskOnMap(mapId: $mapId) {
				pk_userid
				username
			}
		}
	`);

	let selectedUserId: string = '';

	const saveModal = () => {
		if ($modalStore[0].response) {
			$modalStore[0].response({ userId: selectedUserId });
		}
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
			{#if $selectedMapObject?.userId}
				{#await getUser.fetch( { variables: { id: $selectedMapObject?.userId ?? '' }, policy: CachePolicy.NetworkOnly } )}
					<p>Loading...</p>
				{:then user}
					<p class="text-2xl font-medium text-primary-500">{user.data?.getUserById?.username}</p>
				{/await}
			{:else}
				<p class="text-2xl font-medium text-primary-500">No user assigned</p>
			{/if}
			<!-- <input type="text" class="input w-full xl:w-3/4" placeholder="search employee..." > -->

			{#await usersWithNoDeskOnMap.fetch( { variables: { mapId: $editedMapId }, policy: CachePolicy.NetworkOnly } )}
				<p>Loading...</p>
			{:then users}
				{#each users.data?.getUsersWithNoDeskOnMap ?? [] as user}
					<button
						class="btn bg-primary-400"
						on:click={() => {
							selectedUserId = user.pk_userid;
						}}>{user.username}</button
					>
				{/each}
			{/await}

			<div class="flex flex-row space-x-2 justify-end w-full">
				<button class="btn border-2 border-primary-500 w-20" on:click={cancelModal}>
					Cancel
				</button>
				<button class="btn bg-primary-500 w-20" on:click={saveModal}> Save </button>
			</div>
		</div>
	</div>
{/if}
