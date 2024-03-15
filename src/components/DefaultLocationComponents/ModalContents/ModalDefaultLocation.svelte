<script lang="ts">
	import { user } from '$lib/userStore';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { defaultLocation } from '$lib/mutations/location';
	//export let parent: any;

	$: currentUser = $user;
	const modalStore = getModalStore();

	async function setAsDefault() {
		await defaultLocation.mutate({
			lid: $user.location?.pk_locationid!
		});
	}

	function closeModal() {
		modalStore.close();
	}

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
</script>

{#if $modalStore[0]}
	<div class={cBase}>
		<div class="flex flex-col items-center">
			<h1 class="text-2xl">Do you want to set {$user.location?.locationname} as your default</h1>
			<div>
				<a
					class="btn variant-filled-success px-14"
					href="/{$user.location?.locationname}"
					on:click={() => {
						setAsDefault();
						closeModal();
					}}>Yes</a
				>
				<a
					on:click={() => {
						closeModal();
					}}
					class="btn variant-filled-error px-14"
					href="/{$user.location?.locationname}">No</a
				>
			</div>
		</div>
	</div>
{/if}
