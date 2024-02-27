<script lang="ts">
	import { Network } from 'lucide-svelte';
	import { defaultLocation } from '$lib/mutations/location';
	import { getAllLocations } from '$lib/queries/floorQueries';
	import { getUserById } from '$lib/queries/userQuerries';
	import { user } from '$lib/userStore';
	import { getModalStore, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { CachePolicy } from '$houdini';

	const modalStore = getModalStore();

	$: getAllLocations.fetch();

	$: locations = $getAllLocations.data?.getAllLocations;

	const toastStore = getToastStore();

	const t: ToastSettings = {
		message: 'Default Location changed successfully.',
		timeout: 3000,
		background: 'variant-filled-primary'
	};
</script>

{#if $modalStore[0]}
	<div class="card p-4 w-modal shadow-xl">
		<div class="flex justify-center items-center flex-col">
			<div class="mb-5">Change default location</div>
			{#if locations}
				<div class="flex justify-center items-center flex-col gap-5">
					{#each locations as location}
						<button
							class="btn btn-block variant-filled-primary w-2/3 px-14"
							on:click={async () => {
								await defaultLocation.mutate({
									lid: location.pk_locationid
								});
								await getUserById.fetch({ variables: { id: $user?.pk_userid }, policy: CachePolicy.NetworkOnly });
								modalStore.close();
								toastStore.trigger(t);
							}}
						>
							{location?.locationname}
						</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
{/if}

<style>
</style>
