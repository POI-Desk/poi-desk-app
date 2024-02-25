<script lang="ts">
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
	export let selection: PredictionSelection;
	let predictionData: PredictionData = {
		total: [],
		morning_highestBooking: [],
		morningAverageBooking: [],
		morning_lowestBooking: [],
		afternoon_highestBooking: [],
		afternoonAverageBooking: [],
		afternoon_lowestBooking: []
	};
	let predictionDays: PredictionDays = {
		month: [],
		quarter: [],
		year: []
	};

	enum PredictionType {
		Month,
		Quarter,
		Year
	}
	let type: number = 0;

	async function loadPredictions() {
		switch (selection.showType) {
			case 'Month': {
				type = 0;
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
				if (result) {
					monthlyPrediction = result!.data?.getMonthlyBookingPrediction;
					monthlyPrediction?.forEach((element: any) => {
						if (element) {
							predictionDays.month?.push(element.month);
							predictionData.total?.push(element.total);
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
				type = 1;
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
				if (result) {
					quarterlyPrediction = result!.data?.getQuarterlyBookingPrediction;
					quarterlyPrediction?.forEach((element: any) => {
						if (element) {
							predictionDays.quarter?.push(element.year + ' ' + element.quarter);
							predictionData.total?.push(element.total);
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
				console.log('year');
				type = 2;
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
							predictionData.total?.push(element.total);
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

	async function createDiagramms(id: number) {
		let time;
		console.log('type', type);
		if (type === 0) {
			time = predictionDays.month;
		} else if (type === 1) {
			time = predictionDays.quarter;
		} else if (type === 2) {
			time = predictionDays.year;
		}
		switch (id) {
			case 0: {
				return {
					labels: time,
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
				};
			}
			case 1: {
				return {
					labels: time,
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
				};
			}
		}
	}
	let showType: 'Days' | 'Data' = 'Data';
</script>

{#await loadPredictions() then data}
	<div class="card w-1/2 h-full bg-white rounded-3xl flex items-center justify-center flex-col">
		<div class="flex flex-col gap-2 w-full h-full">
			<div class="flex w-full h-1/2 gap-2">
				<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
					<p class="p-2" style="font-size:60px;">
						{predictionDays.month[predictionDays.month.length - 1]}
					</p>
					<p class="p-2" style="font-size:20px;">Year</p>
				</div>
				<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
					<p class="p-2" style="font-size:60px;">
						{predictionDays.month[predictionDays.month.length - 1]}
					</p>
					<p class="p-2" style="font-size:20px;">Month</p>
				</div>
			</div>
			<div class="flex w-full h-1/2 gap-2">
				<div class="w-full h-full rounded-3xl flex items-center justify-center flex-col">
					<p class="p-2" style="font-size:60px;">
						3000
					</p>
					<p class="p-2" style="font-size:20px;">Total</p>
				</div>
			</div>
		</div>
	</div>
	<div class="card w-full h-full bg-white flex flex-row">
		<div class="card w-full h-full bg-white rounded-3xl flex items-center justify-center flex-col">
			{#await createDiagramms(0) then data}
				<PredictionCharts {data} />
			{/await}
		</div>
		<div class="card h-full w-10 bg-white rounded-3xl flex items-center justify-center">
			<div class="h-full flex flex-row">
				<RadioGroup
					flex="flex"
					active="variant-filled-primary"
					hover="hover:variant-soft-primary"
					flexDirection="flex-column"
				>
					<div class="flex flex-col justify-center h-full">
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
		<div class="card w-full h-full bg-white rounded-3xl flex items-center justify-center flex-col">
			{#await createDiagramms(1) then data}
				<PredictionCharts {data} />
			{/await}
		</div>
	</div>
{/await}

<!--
<div class="h-full card p-4 w-full flex flex-col rounded-3xl">
	<div class="h-1/2 w-full flex flex-row">
		<div class="card w-1/2 h-full bg-white rounded-3xl flex items-center justify-center flex-col" />
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
</div>-->
