<script lang="ts">
	import BarChart from '$components/AnalysisComponents/BarChart.svelte';
	import { onMount } from 'svelte';
	import { MonthlyBookingsByLocation, Last30DaysByLocation } from '$lib/queries/analysisQueries';
	import { user } from '$lib/userStore';
	import Chart from 'chart.js/auto';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import {
		storePopup,
		RadioGroup,
		RadioItem,
		ListBox,
		ListBoxItem,
		popup
	} from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export let location: any;

	async function loadDays() {
		const result = await Last30DaysByLocation.fetch({
			variables: { location: location?.pk_locationid || '' }
		});
		if (result && chartLabels.length == 0) {
			let monthlyBookingResult = result.data?.getLast30DaysByLocation;
			monthlyBookingResult?.forEach(
				(element: { day: String; morning: number; afternoon: number; total: number } | null) => {
					if (element?.total != 0) {
						chartLabels.push(element?.day!);
						morningValues.push(element?.morning!);
						afternoonValues.push(element?.afternoon!);
						totalValues.push(element?.total!);
					}
				}
			);
		}
		await computeData();
		return {
			labels: chartLabels,
			datasets: [
				{
					label: 'morning',
					data: morningValues,
					backgroundColor: 'rgb(255, 99, 132)',
					borderWidth: 1
				},
				{
					label: 'afternoon',
					data: afternoonValues,
					backgroundColor: 'rgb(54, 162, 235)',
					borderWidth: 1
				}
			]
		};
	}
	let totalValues: number[] = [];
	let morningValues: number[] = [];
	let afternoonValues: number[] = [];
	let chartLabels: [String?] = [];
	let computedData: {
		total: number;
		max: number;
		min: number;
		avg: number;
	};
	let maxdays: number[] = [];
	let mindays: number[] = [];

	async function computeData() {
		computedData = {
			total: totalValues.reduce((acc, value) => acc + (value || 0), 0),
			max: Math.max(...totalValues),
			min: Math.min(...totalValues),
			avg: Math.round(totalValues.reduce((acc, value) => acc + (value || 0), 0) / totalValues.length)
		};
		totalValues.filter((value) => value == computedData.max).forEach((value) => {
			maxdays.push(value);
		});
		totalValues.filter((value) => value == computedData.min).forEach((value) => {
			mindays.push(value);
		});
	}

	const totalHover: PopupSettings = {
		event: 'hover',
		target: 'totalHover',
		placement: 'top'
	};
	const maxHover: PopupSettings = {
		event: 'hover',
		target: 'maxHover',
		placement: 'top'
	};
	const avgHover: PopupSettings = {
		event: 'hover',
		target: 'avgHover',
		placement: 'top'
	};
	const minHover: PopupSettings = {
		event: 'hover',
		target: 'minHover',
		placement: 'top'
	};
</script>

{#await loadDays()}
	<p>Loading...</p>
{:then data}
	<div class="w-2/5 text-black rounded-3xl flex items-center justify-center">
		<BarChart {data} title="Bookings - {$user.location?.locationname}" />
	</div>
	<div class="w-1/2  text-black rounded-3xl flex items-center justify-center p-2>">
		<div class="flex flex-col gap-2 w-full ">
			<div class="flex w-full h-1/2 gap-2">
				<div class="w-1/2  rounded-3xl flex items-center justify-center">
					<div
						class="[&>*]:pointer-events-none flex items-center justify-center flex-col"
						use:popup={totalHover}
					>
						<p class="p-2" style="font-size:60px;">{computedData.total}</p>
						<p class="p-2" style="font-size:20px;">Total</p>
					</div>
				</div>
				<div class="w-1/2  rounded-3xl flex items-center justify-center">
					<div
						class="[&>*]:pointer-events-none flex items-center justify-center flex-col"
						use:popup={maxHover}
					>
						<p class="p-2" style="font-size:60px;">{computedData.max}</p>
						<p class="p-2" style="font-size:20px;">Max</p>
					</div>
				</div>
			</div>
			<div class="flex w-full h-1/2 gap-2">
				<div class="w-1/2  rounded-3xl flex items-center justify-center">
					<div
						class="[&>*]:pointer-events-none flex items-center justify-center flex-col"
						use:popup={avgHover}
					>
						<p class="p-2" style="font-size:60px;">{computedData.avg}</p>
						<p class="p-2" style="font-size:20px;">Avg</p>
					</div>
				</div>
				<div class="w-1/2  rounded-3xl flex items-center justify-center">
					<div
						class="[&>*]:pointer-events-none flex items-center justify-center flex-col"
						use:popup={minHover}
					>
						<p class="p-2" style="font-size:60px;">{computedData.min}</p>
						<p class="p-2" style="font-size:20px;">min</p>
					</div>
				</div>
			</div>
		</div>
	</div>

<div class="card p-4 variant-filled-secondary" data-popup="totalHover">
	<p style="font-size:12px;">
		The total amount of bookings in {$user.location?.locationname} over the last 30 days
	</p>
	<div class="arrow variant-filled-secondary" />
</div>

<div class="card p-4 variant-filled-secondary" data-popup="maxHover">
	<p style="font-size:12px;">
		<!--The maximum amount of bookings in {$user.location?.locationname} on a single day: {maxdays.forEach((day) => chartLabels[day])}-->
		The maximum amount of bookings in {$user.location?.locationname} on a single day: {chartLabels[totalValues.indexOf(computedData.max)]}

	</p>
	<div class="arrow variant-filled-secondary" />
</div>

<div class="card p-4 variant-filled-secondary" data-popup="avgHover">
	<p style="font-size:12px;">
		The average amount of bookings in {$user.location?.locationname} over the last 30 days
	</p>
	<div class="arrow variant-filled-secondary" />
</div>

<div class="card p-4 variant-filled-secondary" data-popup="minHover">
	<p style="font-size:12px;">
		The minimum amount of bookings in {$user.location?.locationname} on a single day: {chartLabels[totalValues.indexOf(computedData.min)]}
	</p>
	<div class="arrow variant-filled-secondary" />
</div>

{/await}

