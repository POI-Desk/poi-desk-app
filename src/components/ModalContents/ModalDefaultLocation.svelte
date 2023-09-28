<script lang="ts">
	import { chosenLocation } from '$lib/locationStore';
	import { createEventDispatcher } from 'svelte';
	import { graphql } from '$houdini';
	import type { Location } from '$lib/types/locationType';
	import { user } from '$lib/userStore';
	import { getModalStore } from '@skeletonlabs/skeleton';
	export let parent: any;

	$: currentUser = $user;
	const modalStore = getModalStore();

	const defaultLocation = graphql(`
		mutation DefaultLocation($uid: ID!, $lid: ID!) {
			setdefaultLocation(userid: $uid, locationid: $lid)
		}
	`);

	async function setAsDefault() {
		await defaultLocation.mutate({
			uid: currentUser.pk_userid,
			lid: $chosenLocation.pk_locationid
		});
	}

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
</script>

{#if $modalStore[0]}
	<div class={cBase}>
		<div>
			<h1 class="text-2xl">Do you want to set {$chosenLocation.locationname} as your default</h1>
			<div class="flex">
				<a
					class="btn variant-filled-success px-14 justify-self-start"
					href="."
					on:click={() => {
						setAsDefault();
						modalStore.close();
					}}>Yes</a
				>
				<a
					on:click={() => {
						modalStore.close();
					}}
					class="btn variant-filled-error px-14 justify-self-end"
					href=".">No</a
				>
			</div>
		</div>
	</div>
{/if}
