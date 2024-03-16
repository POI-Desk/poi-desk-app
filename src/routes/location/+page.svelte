<script lang="ts">
	// TODO: BITTE KEINE PAGE SONDERN MODAL @LEOPOLD
	import type { PageData } from './$houdini';
	import { user } from '$lib/userStore';
	import { floorid } from '$lib/floorStore';
	import { buildingid } from '$lib/buildingStore';
	import { graphql } from '$houdini';
	import * as AlertDialog from '$lib/components/ui/alert-dialog';
	import { defaultLocation } from '$lib/mutations/location';
	import { goto } from '$app/navigation';

	async function setAsDefault() {
		await defaultLocation.mutate({
			lid: $user.location?.pk_locationid!
		});
	}

	// export const _getAllLocationsVariables = () => {
	// 	return {};
	// };
	export let data: PageData;

	const getAllLocationsPage = graphql(`
		query getAllLocations @load {
			getAllLocations {
				pk_locationid
				locationname
			}
		}
	`);


	$: ({ getAllLocations } = data);
	$: locations = $getAllLocations.data?.getAllLocations;
</script>

<div class="grid place-items-center place-content-center space-y-6 h-screen">
	<h1 class="text-2xl">Choose Your Location:</h1>
	{#if locations}
		<AlertDialog.Root>
			{#each locations as location}
				<AlertDialog.Trigger
					on:click={() => {
						$user.location = {
							locationname: location?.locationname,
							pk_locationid: location?.pk_locationid
						};
						$floorid = '';
						$buildingid = '';
					}}
				>
					{location?.locationname}
				</AlertDialog.Trigger>
			{/each}
			<AlertDialog.Content>
				<AlertDialog.Header>
					<AlertDialog.Title class="text-center"
						>Do you want to set {$user.location?.locationname} as your default?</AlertDialog.Title
					>
					<AlertDialog.Description>
						<div class="flex flex-col items-center">
							<div>
								<AlertDialog.Action
									class="btn variant-filled-success px-14 bg-primary"
									on:click={() => {
										setAsDefault();
										goto('/');
									}}>Yes</AlertDialog.Action
								>
								<AlertDialog.Cancel
									on:click={() => {
										goto('/');
									}}
									class="btn variant-filled-error px-14 bg-destructive">No</AlertDialog.Cancel
								>
							</div>
						</div>
					</AlertDialog.Description>
				</AlertDialog.Header>
			</AlertDialog.Content>
		</AlertDialog.Root>
	{/if}
</div>
