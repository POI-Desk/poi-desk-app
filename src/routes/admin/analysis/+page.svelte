<script lang="ts">
	import DataSelectionCard from '$components/AnalysisComponents/DataSelectionCard.svelte';
	import Last30Days from '$components/AnalysisComponents/Last30Days.svelte';
	import { getBuildingsWithFloors } from '$lib/queries/buildingQueries';
	import type { Building } from '$lib/types/buildingType';
	import type { Floor } from '$lib/types/floorType';
	import { user } from '$lib/userStore';
	import type { PageData } from './$types';
	

	export let data: PageData;

	$: userLocation =  data.location.data?.getLocationByName;

	async function loadData() {
		if (buildingsWithFloors.length <= 1) {
			const resultsFromBuildings = await getBuildingsWithFloors.fetch({
				variables: { locationid: userLocation?.pk_locationid || '' }
			});
			console.log(userLocation);
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

<div class="h-screen w-full flex flex-col justify-between p-4">
	<div class="h-screen w-full flex flex-col justify-between bg-gray-50 rounded-3xl">
		<!--Last 30 Days-->
		<div class="p-4 w-full h-full flex flex-col">
			<div class="w-full h-1/8">
				<p class="flex justify-center" style="font-size:40px;">Last 30 Days</p>
			</div>
			<div class="flex flex-row w-full h-full">
				<div class="w-full h-ful rounded-3xl flex items-center justify-center">
					<Last30Days />
				</div>
			</div>
		</div>
		<hr/>

		<div class="p-4 w-full h-full flex flex-col">
			<div class="w-full h-1/8">
				<p class="flex justify-center" style="font-size:40px;">Select Anaylsis</p>
			</div>
			<div class="flex flex-row w-full h-full">
				<div class="w-full h-ful rounded-3xl flex items-center justify-center">
					{#await getData()}
						<p>loading...</p>
					{:then data}
						<DataSelectionCard buildings={buildingsWithFloors} />
					{/await}
				</div>
			</div>
		</div>
	</div>
</div>
