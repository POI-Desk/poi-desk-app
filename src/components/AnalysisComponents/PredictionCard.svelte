<script lang="ts">
	/*
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import { get } from 'svelte/store';
	import type { Building } from '$lib/types/buildingType';
	import { IdentifierType } from '$houdini/graphql/enums.js';
	import { getBuildingsWithFloors } from '$lib/queries/buildingQueries';
	import type { Floor } from '$lib/types/floorType';
	import { user } from '$lib/userStore';
	import type { PredictionSelection, PredictionDays } from '$lib/types/predictionType';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { BarChart3, File, Info } from 'lucide-svelte';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import type {
		MonthlyPrediction,
		QuarterlyPrediction,
		YearlyPrediction,
		PredictionData
	} from '$lib/types/predictionType';
	import {
		getMonthlyBookingPrediction,
		getQuarterlyBookingPrediction,
		getYearlyBookingPrediction
	} from '$lib/queries/predictionQueries';
	import {
		storePopup,
		RadioGroup,
		RadioItem,
		ListBox,
		ListBoxItem,
		popup
	} from '@skeletonlabs/skeleton';
	import PredictionCharts from './PredictionCharts.svelte';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export const CHART_COLORS = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	};

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
		return buildingsWithFloors;
	}

	let monthlyPredictions: MonthlyPrediction[] = [];
	let quarterlyPredictions: QuarterlyPrediction[] = [];
	let yearlyPredictions: YearlyPrediction[] = [];
	let predictionData: PredictionData = {
		morning_highestBooking: [],
		morningAverageBooking: [],
		morning_lowestBooking: [],
		afternoon_highestBooking: [],
		afternoonAverageBooking: [],
		afternoon_lowestBooking: []
	};
	let predictionDays: PredictionDays = {
		year: null,
		quarter: null,
		month: null,
		type: null
	};

	async function loadPredictions() {
		switch (selection.showType) {
			case 'Month': {
				let result;
				let monthlyPrediction;
				if (
					(selection.Building?.buildingid === '' || selection.Building === null) &&
					(selection.Floor?.floorid === '' || selection.Floor === null)
				) {
					result = await getMonthlyBookingPrediction.fetch({
						variables: {
							identifier: $user.location?.pk_locationid!,
							identifierType: IdentifierType.Location
						}
					});
				} else if (
					selection.Building &&
					(selection.Floor?.floorid == '' || selection.Floor == null)
				) {
					result = await getMonthlyBookingPrediction.fetch({
						variables: {
							identifier: selection.Building.buildingid!,
							identifierType: IdentifierType.Building
						}
					});
				} else if (selection.Building && selection.Floor) {
					result = await getMonthlyBookingPrediction.fetch({
						variables: {
							identifier: selection.Floor.floorid!,
							identifierType: IdentifierType.Building
						}
					});
				}
				console.log(result);
				if (result) {
					monthlyPrediction = result!.data?.getMonthlyBookingPrediction;
					monthlyPrediction?.forEach((element: any) => {
						if (element) {
							predictionDays.month?.push(element.month);
							predictionDays.type = 'Month';
							predictionData.morning_highestBooking?.push(element.morning_highestBooking);
							predictionData.morningAverageBooking?.push(element.morningAverageBooking);
							predictionData.morning_lowestBooking?.push(element.morning_lowestBooking);
							predictionData.afternoon_highestBooking?.push(element.afternoon_highestBooking);
							predictionData.afternoonAverageBooking?.push(element.afternoonAverageBooking);
							predictionData.afternoon_lowestBooking?.push(element.afternoon_lowestBooking);
						}
					});
					break;
				}
			}
			case 'Quarter': {
				let result;
				let quarterlyPrediction;
				if (
					(selection.Building?.buildingid == '' || selection.Building == null) &&
					(selection.Floor?.floorid == '' || selection.Floor == null)
				) {
					result = await getQuarterlyBookingPrediction.fetch({
						variables: {
							identifier: $user.location?.pk_locationid!,
							identifierType: IdentifierType.Location
						}
					});
				} else if (
					selection.Building &&
					(selection.Floor?.floorid == '' || selection.Floor == null)
				) {
					result = await getQuarterlyBookingPrediction.fetch({
						variables: {
							identifier: selection.Building.buildingid!,
							identifierType: IdentifierType.Building
						}
					});
				} else if (selection.Building && selection.Floor) {
					result = await getQuarterlyBookingPrediction.fetch({
						variables: {
							identifier: selection.Floor.floorid!,
							identifierType: IdentifierType.Building
						}
					});
				}
				console.log(result);
				if (result) {
					quarterlyPrediction = result!.data?.getQuarterlyBookingPrediction;
					quarterlyPrediction?.forEach((element: any) => {
						if (element) {
							predictionDays.quarter?.push(element.year + ' ' + element.quarter);
							predictionDays.type = 'Quarter';
							predictionData.morning_highestBooking?.push(element.morning_highestBooking);
							predictionData.morningAverageBooking?.push(element.morningAverageBooking);
							predictionData.morning_lowestBooking?.push(element.morning_lowestBooking);
							predictionData.afternoon_highestBooking?.push(element.afternoon_highestBooking);
							predictionData.afternoonAverageBooking?.push(element.afternoonAverageBooking);
							predictionData.afternoon_lowestBooking?.push(element.afternoon_lowestBooking);
						}
					});
					break;
				}
			}
			case 'Year': {
				let result;
				let yearlyPrediction;
				if (
					(selection.Building?.buildingid == '' || selection.Building == null) &&
					(selection.Floor?.floorid == '' || selection.Floor == null)
				) {
					result = await getYearlyBookingPrediction.fetch({
						variables: {
							identifier: $user.location?.pk_locationid!,
							identifierType: IdentifierType.Location
						}
					});
				} else if (
					selection.Building &&
					(selection.Floor?.floorid == '' || selection.Floor == null)
				) {
					result = await getYearlyBookingPrediction.fetch({
						variables: {
							identifier: selection.Building.buildingid!,
							identifierType: IdentifierType.Building
						}
					});
				} else if (selection.Building && selection.Floor) {
					result = await getYearlyBookingPrediction.fetch({
						variables: {
							identifier: selection.Floor.floorid!,
							identifierType: IdentifierType.Building
						}
					});
				}

				if (result) {
					yearlyPrediction = result!.data?.getYearlyBookingPrediction;
					yearlyPrediction?.forEach((element: any) => {
						if (element) {
							predictionDays.year?.push(element.year);
							predictionDays.type = 'Year';
							predictionData.morning_highestBooking?.push(element.morning_highestBooking);
							predictionData.morningAverageBooking?.push(element.morningAverageBooking);
							predictionData.morning_lowestBooking?.push(element.morning_lowestBooking);
							predictionData.afternoon_highestBooking?.push(element.afternoon_highestBooking);
							predictionData.afternoonAverageBooking?.push(element.afternoonAverageBooking);
							predictionData.afternoon_lowestBooking?.push(element.afternoon_lowestBooking);
						}
					});
					break;
				}
			}
			default:
				return 'Invalid section';
		}
	}

	let selection: PredictionSelection = {
		Building: buildingsWithFloors[0] ?? null,
		Floor: buildingsWithFloors[0].floors[0] ?? null,
		showType: 'Quarter'
	};

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

	let ctx;
	let morningCanvas: any;
	let ctx2;
	let afternoonCanvas: any;

	let diagrammOptions: any = {
		responsive: true,
		plugins: {
			legend: {
				position: 'top'
			},
			title: {
				display: true,
				text: 'Chart.js Line Chart'
			}
		}
	};

	async function createDiagramms(id: number) {
		if (!predictionData.afternoonAverageBooking?.length) await loadPredictions();
		let time;

		switch (predictionDays.type) {
			case 'Month': {
				time = predictionDays.month;
			}
			case 'Quarter': {
				time = predictionDays.quarter;
			}
			case 'Year': {
				time = predictionDays.year;
			}
		}
		switch (id) {
			case 0: {
				return {
					time: time,
					morning_highestBooking: predictionData.morning_highestBooking,
					morningAverageBooking: predictionData.morningAverageBooking,
					morning_lowestBooking: predictionData.morning_lowestBooking
				};
			}
			case 1: {
				return {
					time: time,
					afternoon_highestBooking: predictionData.afternoon_highestBooking,
					afternoonAverageBooking: predictionData.afternoonAverageBooking,
					afternoon_lowestBooking: predictionData.afternoon_lowestBooking
				};
			}
		}

		ctx = morningCanvas.getContext('2d');
		var morningChart = new Chart(ctx, {
			type: 'line',
			data: {
				labels: monthlyPredictions.map((m) => m.month),
				datasets: [
					{
						label: 'morning_highestBooking',
						data: predictionData.morning_highestBooking,
						backgroundColor: CHART_COLORS.orange,
						borderColor: CHART_COLORS.orange
					},
					{
						label: 'morningAverageBooking',
						data: predictionData.morningAverageBooking,
						backgroundColor: CHART_COLORS.purple,
						borderColor: CHART_COLORS.purple
					},
					{
						label: 'morning_lowestBooking',
						data: predictionData.morning_lowestBooking,
						backgroundColor: CHART_COLORS.blue,
						borderColor: CHART_COLORS.blue
					}
				]
			},
			options: diagrammOptions
		});

		ctx2 = afternoonCanvas.getContext('2d');
		var afternoonChart = new Chart(ctx2, {
			type: 'line',
			data: {
				labels: monthlyPredictions.map((m) => m.month),
				datasets: [
					{
						label: 'afternoon_highestBooking',
						data: predictionData.afternoon_highestBooking,
						backgroundColor: CHART_COLORS.green,
						borderColor: CHART_COLORS.green
					},
					{
						label: 'afternoonAverageBooking',
						data: predictionData.afternoonAverageBooking,
						backgroundColor: CHART_COLORS.yellow,
						borderColor: CHART_COLORS.yellow
					},
					{
						label: 'afternoon_lowestBooking',
						data: predictionData.afternoon_lowestBooking,
						backgroundColor: CHART_COLORS.grey,
						borderColor: CHART_COLORS.grey
					}
				]
			},
			options: diagrammOptions
		});
	}

	onMount(async () => {
		await loadBuildings();
	});
	let showType: 'Days' | 'Data' = 'Data';*/
</script>

<!--
<div class="h-full card p-4 w-full flex flex-col rounded-3xl">
	<div class="h-1/2 w-full flex flex-row">
		<div class="card w-1/2 h-full bg-white rounded-3xl flex items-center justify-center flex-col">
			{#await loadBuildings() then data}
				<p>building:</p>
				<Button class="btn variant-filled w-48 justify-between" use:popup={buildingSelection}>
					<span class="capitalize">{selection.Building?.buildingname ?? 'Building'}</span>
					<span>↓</span>
				</Button>
				<p>Floor:</p>
				<Button class="btn variant-filled w-48 justify-between" use:popup={floorSelection}>
					{#key selection.Floor}
						<span class="capitalize">{selection.Floor?.floorname ?? 'Floor'}</span>
					{/key}
					<span>↓</span>
				</Button>
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
			{/await}
		</div>
		<div class="card w-1/2 h-full bg-white rounded-3xl flex items-center justify-center">
			<div class="flex flex-col gap-2 w-full h-full">
				<div class="flex w-full h-1/2 gap-2">
					<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
						<p class="p-2" style="font-size:60px;">2024</p>
						<p class="p-2" style="font-size:20px;">year</p>
					</div>
					<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
						<p class="p-2" style="font-size:60px;">April</p>
						<p class="p-2" style="font-size:20px;">Month</p>
					</div>
				</div>
				<div class="flex w-full h-1/2 gap-2">
					<div class="w-full h-full rounded-3xl flex items-center justify-center flex-col">
						<p class="p-2" style="font-size:60px;">7539</p>
						<p class="p-2" style="font-size:20px;">Total</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class="h-1/2 w-full flex flex-row">
		<div class="card w-full h-full bg-white rounded-3xl flex items-center justify-center">
			{#key selection}
				{#await createDiagramms(0) then data}
					<PredictionCharts {data} />
				{/await}
			{/key}
		</div>
		<div class="card h-full w-10 bg-white rounded-3xl flex items-center justify-center">
			<div class="h-full flex flex-row">
				<RadioGroup
					flex="flex"
					active="variant-filled-primary"
					hover="hover:variant-soft-primary"
					flexDirection="flex-column"
				>
					<div class="flex flex-column justify-center h-full">
						<RadioItem bind:group={showType} name="end" value="Days">
							<BarChart3 />
						</RadioItem>
						<RadioItem bind:group={showType} name="end" value="Data">
							<File />
						</RadioItem>
					</div>
				</RadioGroup>
			</div>
		</div>
		<div class="card w-full h-full bg-white rounded-3xl flex items-center justify-center">
			{#key selection}
				{#await createDiagramms(1) then data}
					<PredictionCharts {data} />
				{/await}
			{/key}
		</div>
	</div>
</div>

<div class="card w-48 shadow-xl py-2" data-popup="buildingSelection">
	<ListBox rounded="rounded-none">
		{#key buildingsWithFloors}
			{#each buildingsWithFloors as building}
				<ListBoxItem bind:group={selection.Building} name="medium" value={building}
					>{building.buildingname}</ListBoxItem
				>
			{/each}
		{/key}
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
</div>-->
