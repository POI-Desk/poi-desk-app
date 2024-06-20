<script lang="ts">
	import DataSelectionCard from '$components/AnalysisComponents/DataSelectionCard.svelte';
	import Last30Days from '$components/AnalysisComponents/Last30Days.svelte';
	import { getBuildingsWithFloors } from '$lib/queries/buildingQueries';
	import type { Building } from '$lib/types/buildingType';
	import type { Floor } from '$lib/types/floorType';
	import { user } from '$lib/stores/userStore';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import BurgerMenu from "$components/SuperAdminComponents/BurgerMenu.svelte";
	

	async function loadData() {
		if (buildingsWithFloors.length <= 1) {
			const resultsFromBuildings = await getBuildingsWithFloors.fetch({
				variables: { locationid: $user.location?.pk_locationid || '' }
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
	const btn = "btn variant-filled-primary shadow-md"
</script>

<div class="h-screen w-full flex flex-col justify-between primary-50">
	<div class="flex w-full h-full flex-col justify-between ">
		<!--Last 30 Days-->
		<div class="pt-4 h w-full h-full flex flex-col">
			<div class="w-full h-1/4">
				<p class="flex justify-center" style="font-size:30px;">Last 30 Days</p>
			</div>
			<div class="flex h-full flex-row w-full">
				<div class="w-full flex h-full items-center justify-center">
					<Last30Days location={$user.location} />
				</div>
			</div>
		</div>
		<!--Last 30 Days-->
		<div class="w-full h-full ht-8 flex flex-col">
			<div class="w-full">
				<p class="flex justify-center" style="font-size:30px;">Select Anaylsis</p>
			</div>
			<div class="flex h-full flex-row w-full">
				<div class="flex w-full h-full items-center justify-center">
					{#await getData()}
						<p>loading...</p>
					{:then data}
						<DataSelectionCard buildings={buildingsWithFloors} />
					{/await}
				</div>
			</div>
		</div>
	</div>
	<div class="px-5 primary-50">
		<BurgerMenu>
			<button on:click={() => goto("/")} class="{btn}">Back to POI-Desk</button>
			<button on:click={() => goto("/admin/analysis")} class="{btn}">Analysis</button>
			<button on:click={() => goto("/admin/predictions")} class="{btn}">Prediction</button>
			<button on:click={() => goto(`/admin`)} class="{btn}">Snapshots </button>
		</BurgerMenu>
	</div>
</div>