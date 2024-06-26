<script lang="ts">
	import { IdentifierType } from './../../../../$houdini/graphql/enums.js';
	import {
		getMonthlyBookingPrediction,
		getQuarterlyBookingPrediction,
		getYearlyBookingPrediction
	} from '$lib/queries/predictionQueries';
	import Chart from 'chart.js/auto';
	import type { MonthlyPrediction } from '$lib/types/predictionType';
	import PredictionCard from '$components/AnalysisComponents/PredictionCard.svelte';
	import PredictionOverview from '$components/AnalysisComponents/PredictionOverview.svelte';
	import type { Building } from '$lib/types/buildingType';
	import type { Floor } from '$lib/types/floorType';
	import { user } from '$lib/userStore';
	import { getBuildingsWithFloors } from '$lib/queries/buildingQueries';
	import type { PredictionSelection } from '$lib/types/predictionType';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import {
		storePopup,
		RadioGroup,
		RadioItem,
		ListBox,
		ListBoxItem,
		popup
	} from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	import { onMount } from 'svelte';

	let start: Boolean = false;

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

	let selection: PredictionSelection = {
		Building: buildingsWithFloors[0] ?? null,
		Floor: buildingsWithFloors[0].floors[0] ?? null,
		showType: 'Month'
	};

	async function loadBuildings() {
		if (buildingsWithFloors.length <= 1) {
			let resultsFromBuildings = await getBuildingsWithFloors.fetch({
				variables: { locationid: $user.location?.pk_locationid || '' }
			});
			if (resultsFromBuildings && buildingsWithFloors.length <= 1) {
				let buildings = resultsFromBuildings.data?.getBuildingsInLocation;
				buildings?.forEach((building: any) => {
					let floors: Floor[] = [
						{
							floorid: '',
							floorname: 'All Floors'
						}
					];
					building.floors?.forEach((floor: any) => {
						floors?.push({
							floorid: floor.pk_floorid,
							floorname: floor.floorname
						});
					});
					buildingsWithFloors?.push({
						buildingid: building.pk_buildingid,
						buildingname: building.buildingname,
						floors: floors
					});
				});
			}
		}
		start = true;
		return buildingsWithFloors;
	}

	function onBuildingChange(event: any) {
		//selection.Floor = selection.Building?.floors[0]!;
	}

	const buildingSelection: PopupSettings = {
		event: 'focus-click',
		target: 'buildingSelection',
		placement: 'right',
		closeQuery: '.listbox-item'
	};
	const floorSelection: PopupSettings = {
		event: 'focus-click',
		target: 'floorSelection',
		placement: 'right',
		closeQuery: '.listbox-item'
	};
</script>

<div class="h-full flex flex-col p-5">
	<div class="h-full">
		<!--Last 30 Days-->
		<!--<PredictionCard />-->
		<div class="card h-1/2 flex flex-wrap">
			<div class="card w-1/2 h-full bg-white rounded-3xl flex items-center justify-center flex-col">
				<p>building:</p>
				<button class="btn variant-filled w-48 justify-between" use:popup={buildingSelection}>
					<span class="capitalize">{selection.Building?.buildingname ?? 'Building'}</span>
					<span>↓</span>
				</button>
				<p>Floor:</p>
				<button class="btn variant-filled w-48 justify-between" use:popup={floorSelection}>
					{#key selection.Floor}
						<span class="capitalize">{selection.Floor?.floorname ?? 'Floor'}</span>
					{/key}
					<span>↓</span>
				</button>
				<p>Time:</p>
				<RadioGroup
					flex="flex"
					active="variant-filled-primary"
					hover="hover:variant-soft-primary"
					gap="gap-5"
				>
					<RadioItem bind:group={selection.showType} name="end" value="Month">
						<p>Month</p>
					</RadioItem>
					<RadioItem bind:group={selection.showType} name="end" value="Quarter">
						<p>Quarter</p>
					</RadioItem>
					<RadioItem bind:group={selection.showType} name="end" value="Year">
						<p>Year</p>
					</RadioItem>
				</RadioGroup>
			</div>
			{#key selection}
				{#if start === true}
					<PredictionOverview {selection} />
				{/if}
			{/key}
		</div>
	</div>
</div>

<div class="card w-48 shadow-xl py-2" data-popup="buildingSelection">
	<ListBox rounded="rounded-none">
		{#await loadBuildings()}
			<p>loading...</p>
		{:then data}
			{#each buildingsWithFloors as building}
				<ListBoxItem
					bind:group={selection.Building}
					name="medium"
					value={building}
					on:change={onBuildingChange}>{building.buildingname}</ListBoxItem
				>
			{/each}
		{/await}
	</ListBox>
</div>

<div class="card w-48 shadow-xl py-2" data-popup="floorSelection">
	<ListBox rounded="rounded-none">
		{#each selection.Building?.floors ?? [] as floor}
			<ListBoxItem bind:group={selection.Floor} name="medium" value={floor}
				>{floor.floorname}</ListBoxItem
			>
		{/each}
	</ListBox>
</div>
