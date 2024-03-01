<script lang="ts">
	import { CachePolicy } from '$houdini';
	import { deleteLocation } from '$lib/mutations/locationMutations';
	import { getAdminsOfLocation, getLocations } from '$lib/queries/locationQueries';
	import { onMount } from 'svelte';
	import {
		refreshLocations,
		locationToEdit,
		buildingToEdit,
		locationNames,
		adminsOfLocation,
		admin,
		isSaveDisabled

	} from '$lib/superAdminStore';
	import { showAddLocation } from '$lib/locationStore';

	$: locations = $getLocations?.data?.getAllLocations;
	// $: tempLocAdmins = $getAdminsOfLocation.data?.getAdminsOfLocation;

	onMount(() => {
		getLocationsFunction();
	});

	$: adminsOfLoc = $getAdminsOfLocation.data?.getAdminsOfLocation;

	async function getAdminsOfLocationFunction() {		
		console.log($locationToEdit.id);
		
		const result = await getAdminsOfLocation.fetch({ variables: { locationid: $locationToEdit.id }, policy: CachePolicy.NetworkOnly }).then((value) => {
			console.log("value " + value.data?.getAdminsOfLocation);
			$adminsOfLocation = adminsOfLoc;
		});

		console.log(result);
		
	}

	async function getLocationsFunction() {
		await getLocations.fetch({ policy: CachePolicy.NetworkOnly }).then(() => {
			$locationNames = [''];
			let locations = $getLocations.data?.getAllLocations;

			for (let i = 0; i < locations?.length; i++) {
				$locationNames.push(locations?.at(i)?.locationname.toLowerCase() ?? '');
				$locationNames = $locationNames;
			}
		});
	}

	async function onDeleteLocation(id: string) {
		console.log(id);

		const result = await deleteLocation.mutate({
			id: id
		});
		$refreshLocations = !$refreshLocations;
		getLocationsFunction();
	}

	function compare(a, b) {
		const aName = a.locationname.toLowerCase();
		const bName = b.locationname.toLowerCase();

		if (aName < bName) {
			return -1;
		}
		if (aName > bName) {
			return 1;
		}
		return 0;
	}
</script>

<div>
	{#key $refreshLocations}
		{#await getLocations.fetch({ policy: CachePolicy.NetworkOnly })}
			<p>fetching locations...</p>
		{:then fetched}
			{#each locations.sort((a, b) => compare(a, b)) as location}
				<div>
					<div class="variant-outline-primary">
						{location.locationname}
						<button
							on:click={() => {
								$showAddLocation = false;
								$locationToEdit.id = location.pk_locationid;
								$locationToEdit.name = location.locationname;
								$buildingToEdit.id = '';
								getAdminsOfLocationFunction();
								$isSaveDisabled = true;
								$admin = {pk_userid: "", name: ""};
								$adminsOfLocation = [];
							}}>Edit</button
						>
						<button on:click={() => onDeleteLocation(location.pk_locationid)}>Delete</button>
					</div>
					<br />
				</div>
			{/each}
		{/await}
	{/key}
</div>
