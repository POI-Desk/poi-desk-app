<script lang="ts">
	import { storePopup } from "@skeletonlabs/skeleton";
	import DataSelectionCard from "$components/AnalysisComponents/DataSelectionCard.svelte";
	import Last30Days from "$components/AnalysisComponents/Last30Days.svelte";
	import { arrow, autoUpdate, computePosition, flip, offset, shift } from "@floating-ui/dom";
	import { user } from "$lib/stores/userStore";
	import { getBuildingsWithFloors } from "$lib/queries/buildingQueries";
	import type { Building } from "$lib/types/buildingType";
	import type { Floor } from "$lib/types/floorType";
	import { goto } from "$app/navigation";
	import { onMount } from "svelte";

	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	onMount(() => {
		if (!$user.pk_userid) {
			goto('/login');
		}
	});

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
</script>

<div class="h-screen flex flex-col p-5">
	<div class="h-full flex">
		<!--Last 30 Days-->
		<div class="card bg-white p-4 w-full flex flex-col rounded-3xl">
			<div class="w-full h-1/8">
				<p class="flex justify-center h4">Last 30 Days</p>
			</div>
			<div class="flex flex-row w-full h-full p2">
				<div class="w-full h-ful rounded-3xl flex items-center justify-center">
					<Last30Days />
				</div>
			</div>
		</div>
	</div>

	<div class="h-full flex gap-4 pt-2">
		<div class="card bg-white p-4 w-full flex flex-col rounded-3xl">
			<div class="w-full h-1/8 h4">
				<p class="flex justify-center">Select Anaylsis</p>
			</div>
			<div class="flex flex-row w-full h-full p2">
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

	<!--<div class="h-1/2 flex gap-4">
			{#await getData()}
				<p>loading...</p>
			{:then data}
				<DataSelectionCard buildings={x} />
			{/await}
		</div>-->
</div>
