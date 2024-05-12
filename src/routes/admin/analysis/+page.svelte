<script lang="ts">
	import DataSelectionCard from '$components/AnalysisComponents/DataSelectionCard.svelte';
	import Last30Days from '$components/AnalysisComponents/Last30Days.svelte';
	import { getBuildingsWithFloors } from '$lib/queries/buildingQueries';
	import type { Building } from '$lib/types/buildingType';
	import type { Floor } from '$lib/types/floorType';
	import { user } from '$lib/userStore';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	

	export let data: PageData;

	$: userLocation =  data.location.data?.getLocationByName;

	async function loadData() {
		if (buildingsWithFloors.length <= 1) {
			const resultsFromBuildings = await getBuildingsWithFloors.fetch({
				variables: { locationid: userLocation?.pk_locationid || '' }
			});
			if (resultsFromBuildings && buildingsWithFloors.length <= 1) {
				let buildings = resultsFromBuildings.data?.getBuildingsInLocation;
				buildings?.forEach((building) => {
					let floors: Floor[] = [
						{
							floorid: '',
							floorname: 'All Floors'
						}
					];
					building.floors?.forEach((floor) => {
						floors?.push({
							floorid: floor.pk_floorid,
							floorname: floor.floorname
						});
					});
					buildingsWithFloors?.push({
						buildingid: building.pk_buildingid,
						buildingname: building.buildingname,
						floors: floors!
					});
					x?.push({
						buildingid: building.pk_buildingid,
						buildingname: building.buildingname,
						floors: floors!
					});
				});
			}
		}
	}

	let buildingsWithFloors: Building[] = [
		{
			buildingid: '',
			buildingname: 'All Buildings',
			floors: [
				{
					floorid: '',
					floorname: 'All Floors'
				}
			]
		}
	];
	let x: Building[];

	async function getData(): Promise<any> {
		if (buildingsWithFloors.length == 1) {
			await loadData();
		}
		return true;
	}
</script>

<div class="h-screen w-full flex flex-col justify-between bg-surface-50">
	<div class="w-full h-full flex flex-col justify-between ">
		<!--Last 30 Days-->
		<div class="pt-4 h w-full h-1/2 flex flex-col">
			<div class="w-full h-1/4">
				<p class="flex justify-center" style="font-size:30px;">Last 30 Days</p>
			</div>
			<div class="flex flex-row w-full">
				<div class="w-full  flex items-center justify-center">
					<Last30Days location={userLocation} />
				</div>
			</div>
		</div>
		<!--Last 30 Days-->
		<div class="w-full h-1/2 ht-8 flex flex-col">
			<div class="w-full">
				<p class="flex justify-center" style="font-size:30px;">Select Anaylsis</p>
			</div>
			<div class="flex h-full flex-row w-full">
				<div class="w-full flex items-center justify-center">
					{#await getData()}
						<p>loading...</p>
					{:then data}
						<DataSelectionCard buildings={buildingsWithFloors} />
					{/await}
				</div>
			</div>
		</div>
	</div>
		<div class="flex justify-center bottom-0 items-center p-4 w-full">
			<div class="w-2/3 max-w-screen-lg flex  justify-between p-2 bg-gray-50 rounded-full shadow-around-10">
				<Button class="btn variant-filled-primary" on:click={() => goto('/user')}>User</Button>
				<Button class="btn variant-filled-primary" on:click={() => goto('/')}>Home</Button>
				<Button class="btn variant-filled-primary" on:click={() => goto('/admin/analysis')}
					>Analytics</Button
				>
				<Button class="btn variant-filled-primary" on:click={() => goto('/admin/predictions')}
					>Predictions</Button
				>
			</div>
		</div>
</div>
