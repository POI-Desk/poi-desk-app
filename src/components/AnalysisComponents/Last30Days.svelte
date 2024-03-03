<script lang="ts">
	import BarChart from '$components/AnalysisComponents/BarChart.svelte';
	import { onMount } from 'svelte';
	import { MonthlyBookingsByLocation } from '$lib/queries/analysisQueries';
	import { user } from '$lib/userStore';
	import Chart from 'chart.js/auto';

	async function loadDays() {
		const result = await MonthlyBookingsByLocation.fetch({
			variables: { year: '2024', month: '02', location: $user.location?.pk_locationid || '' }
		});
		if (result && chartLabels.length == 0) {
			let monthlyBookingResult = result.data?.getMonthlyBookingByLocation;
			monthlyBookingResult?.dailyBookings?.forEach(
				(element: { day: String; total: number; morning: number; afternoon: number } | null) => {
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

	async function computeData() {
		computedData = {
			total: totalValues.reduce((acc, value) => acc + (value || 0), 0),
			max: Math.max(...totalValues),
			min: Math.min(...totalValues),
			avg: totalValues.reduce((acc, value) => acc + (value || 0), 0) / totalValues.length
		};
	}
</script>

{#await loadDays()}
	<p>Loading...</p>
{:then data}
	<div class="w-1/2 h-full text-black rounded-3xl flex items-center justify-center">
		<BarChart {data} title="Bookings - {$user.location?.locationname}" />
	</div>
	<div class="w-1/2 h-full text-black rounded-3xl flex items-center justify-center p-2>">
		<div class="flex flex-col gap-2 w-full h-full">
			<div class="flex w-full h-1/2 gap-2">
				<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
					<p class="p-2" style="font-size:60px;">{computedData.total}</p>
					<p class="p-2" style="font-size:20px;">Total</p>
				</div>
				<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
					<p class="p-2" style="font-size:60px;">{computedData.max}</p>
					<p class="p-2" style="font-size:20px;">Max</p>
				</div>
			</div>
			<div class="flex w-full h-1/2 gap-2">
				<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
					<p class="p-2" style="font-size:60px;">{computedData.avg}</p>
					<p class="p-2" style="font-size:20px;">Avg</p>
				</div>
				<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
					<p class="p-2" style="font-size:60px;">{computedData.min}</p>
					<p class="p-2" style="font-size:20px;">Min</p>
				</div>
			</div>
		</div>
	</div>
{/await}
