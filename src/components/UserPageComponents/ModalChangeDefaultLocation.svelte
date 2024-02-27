<script lang="ts">
	import { Network } from 'lucide-svelte';
	import { defaultLocation } from '$lib/mutations/location';
	import { getUserByid } from '$lib/queries/userQuerries';
	import { user } from '$lib/userStore';
	import { getModalStore, getToastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { CachePolicy, graphql } from '$houdini';

	const modalStore = getModalStore();

	const getAllLocationsChange = graphql(`
		query getAllLocationsChange {
			getAllLocations {
				pk_locationid
				locationname
			}
		}
	`);

	$: getAllLocationsChange.fetch();

	$: locations = $getAllLocationsChange.data?.getAllLocations;

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
								await getUserByid.fetch({ policy: CachePolicy.NetworkOnly });
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
