<script lang="ts">
	import { CachePolicy, graphql } from '$houdini';
	import { Button } from '$lib/components/ui/button';
	import { editedMapId } from '$lib/stores/mapCreationStore';
	import { selectedMapObject } from '$lib/stores/mapObjectStore';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

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

	$: console.log($selectedMapObject);

	function selectedUserChange() {
		console.log(selectedUserId, 'called');
		dispatch('selectedUserChange', { userId: selectedUserId });
	}
</script>

<div class="rounded-xl shadow-3xl flex flex-col items-center">
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
				<Button
					class="btn bg-primary-400"
					on:click={() => {
						selectedUserId = user.pk_userid;
						selectedUserChange();
					}}>{user.username}</Button
				>
			{/each}
		{/await}

		<slot />
	</div>
</div>
