<script lang="ts">
	import { building } from '$app/environment';
	import BarChart from '$components/AnalysisComponents/BarChart.svelte';
	import DataChart from '$components/AnalysisComponents/DataChart.svelte';
	import ComparisonBarChart from '$components/AnalysisComponents/ComparisonBarChart.svelte';
	import DaisplayData from '$components/AnalysisComponents/DaisplayData.svelte';
	import { MonthlyBookingsByLocation, YearsSinceStart } from '$lib/queries/analysisQueries';
	import { RadioGroup, RadioItem, ListBox, ListBoxItem, popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import type { AnalysisResult, AnalysisComparisonInfo, AnalysisComparisonInfoBoth } from '$lib/types/analysisResultType';
	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import { user } from '$lib/userStore';
	import { getBuildingsWithFloors } from '$lib/queries/buildingQueries';
	import type { Building } from '$lib/types/buildingType';
	import type { Floor } from '$lib/types/floorType';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { storePopup } from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	onMount(() => {
		getYears();
		if (!$user.pk_userid) {
			goto('/login');
		}
	});

	let years = ['2023'];

	let analysisResult: AnalysisResult = {
		month: '',
		amountOfDesks: 0,
		highestBookings: 0,
		averageBookings: 0,
		lowestBookings: 0,
		totalBooking: 0
	};

	async function getYears(): Promise<string[]>{
		const result = await YearsSinceStart.fetch();
		if (result) {
			years = result.data?.getAllYears ?? [];
		}
		return [];
	}


	async function loadData() {
		const result = await MonthlyBookingsByLocation.fetch({
			variables: { year: '2024', month: '01', location: $user.location?.pk_locationid || '' }
		});
		if (result && chartLabels.length == 0) {
			let monthlyBookingResult = result.data?.getMonthlyBookingByLocation;
			monthlyBookingResult?.dailyBookings?.forEach(
				(
					element: { day: String; totalBookings: Number; morning: Number; afternoon: Number } | null
				) => {
					if (element?.totalBookings != 0) {
						chartLabels.push(element?.day!);
						morningValues.push(element?.morning!);
						afternoonValues.push(element?.afternoon!);
						chartValues.push(element?.totalBookings!);
					}
				}
			);
		}
		if(buildingsWithFloors.length <= 1)
		{
			const resultsFromBuildings = await getBuildingsWithFloors.fetch({
				variables: { locationid: $user.location?.pk_locationid || '' }
			});
			if (resultsFromBuildings && buildingsWithFloors.length <= 1){
				let buildings = resultsFromBuildings.data?.getBuildingsInLocation;
				buildings?.forEach((building) => {
					let floors: Floor[] = [{
						floorid: '',
						floorname: 'All Floors'
					}];
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
				});
			}
		}
	}

	let buildingsWithFloors: Building[] = [{
			buildingid: '',
			buildingname: 'All Buildings',
			floors: [
				{
					floorid: '',
					floorname: 'All Floors'
				}
			]
		}];
	let chartValues: [Number?] = [];
	let morningValues: [Number?] = [];
	let afternoonValues: [Number?] = [];
	let chartLabels: [String?] = [];

	let comparison: AnalysisComparisonInfoBoth = {
		first: {
			Year: null,
			Month: null,
			Building: null,
			Floor: null,
		},
		second: {
			Year: null,
			Month: null,
			Building: null,
			Floor: null,
		},
		showType: 'Days'
	};

	const firstSelectYear: PopupSettings = {
		event: 'focus-click',
		target: 'firstSelectYear',
		placement: 'right',
		closeQuery: '.listbox-item'
	};

	const firstSelectMonth: PopupSettings = {
		event: 'focus-click',
		target: 'firstSelectMonth',
		placement: 'right',
		closeQuery: '.listbox-item'
	};

	const firstSelectBuilding: PopupSettings = {
		event: 'focus-click',
		target: 'firstSelectBuilding',
		placement: 'right',
		closeQuery: '.listbox-item'
	};
	const firstSelectFloor: PopupSettings = {
		event: 'focus-click',
		target: 'firstSelectFloor',
		placement: 'right',
		closeQuery: '.listbox-item'
	};
	
	const secondSelectYear: PopupSettings = {
		event: 'focus-click',
		target: 'secondSelectYear',
		placement: 'right',
		closeQuery: '.listbox-item'
	};
	const secondSelectMonth: PopupSettings = {
		event: 'focus-click',
		target: 'secondSelectMonth',
		placement: 'right',
		closeQuery: '.listbox-item'
	};
		const secondSelectBuilding: PopupSettings = {
		event: 'focus-click',
		target: 'secondSelectBuilding',
		placement: 'right',
		closeQuery: '.listbox-item'
	};
	const secondSelectFloor: PopupSettings = {
		event: 'focus-click',
		target: 'secondSelectFloor',
		placement: 'right',
		closeQuery: '.listbox-item'
	};

	let monthData = {
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

	const selectableTimePeriods = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
		'Q1',
		'Q2',
		'Q3',
		'Q4',
		'All'
	];

	async function getData(dataNumber: number): Promise<any> {
		if (analysisResult.month === '') {
			await loadData();
		}
		switch (dataNumber) {
			case 0:
				return monthData;
			case 1:
				return {
					month: analysisResult.month,
					amountOfDesks: analysisResult.amountOfDesks,
					totalBooking: analysisResult.totalBooking,
					highestBookings: analysisResult.highestBookings,
					averageBookings: analysisResult.averageBookings,
					lowestBookings: analysisResult.lowestBookings
				};
			case 2:
				true;
		}
	}
	let value = 0;
</script>

<div class="container">
	<div class="Title">
		<div class="flex align-item-center justify-items-cente">
			<p style="font-size: 40px;">Analysis</p>
			<a class="btn variant-filled-primary" href="/">Map</a>
		</div>
	</div>
	<div class="first-Dia">
		<div class="flex align-item-center justify-items-cente">
			{#await getData(0)}
				<p>loading...</p>
			{:then data}
				<div class="ComparisonBarChart">
					<BarChart {data} title="Total amount of Seats Booked" />
				</div>
			{/await}
		</div>
	</div>
	<div class="second-Dia">
		<div class="flex align-item-center justify-items-cente">
			{#await getData(1)}
				<p>loading...</p>
			{:then data}
					<DataChart
						year={'2024'}
						selectedTimePeriod={'January'}
						building={null}
						floor={null}
					/>
				<!--<BarChart data={data} title="Max Avg Min" />-->
			{/await}
		</div>
	</div>

	<div class="first-sel">
		<div class="flex align-item-center justify-items-cente">
			<div>
				<button class="btn variant-filled w-48 justify-between" use:popup={firstSelectYear}>
					<span class="capitalize">{comparison.first.Year ?? '1.Year'}</span>
					<span>↓</span>
				</button>
				<button class="btn variant-filled w-48 justify-between" use:popup={firstSelectMonth}>
					<span class="capitalize">{comparison.first.Month ?? '1.TimePeriods'}</span>
					<span>↓</span>
				</button>
				{#await getData(2)}
				<p>loading...</p>
				{:then data}
				<button class="btn variant-filled w-48 justify-between" use:popup={firstSelectBuilding}>
					<span class="capitalize">{comparison.first.Building?.buildingname ?? '1.Building'}</span>
					<span>↓</span>
				</button>
				<button class="btn variant-filled w-48 justify-between" use:popup={firstSelectFloor}>
					<span class="capitalize">{comparison.first.Floor?.floorname ?? '1.Floor'}</span>
					<span>↓</span>
				</button>
				{/await}
			</div>
		</div>
	</div>

	<div class="second-sel">
		<div class="flex align-item-center justify-items-cente">
			<div>
				<button class="btn variant-filled w-48 justify-between" use:popup={secondSelectYear}>
					<span class="capitalize">{comparison.second.Year ?? '2.Year'}</span>
					<span>↓</span>
				</button>
				<button class="btn variant-filled w-48 justify-between" use:popup={secondSelectMonth}>
					<span class="capitalize">{comparison.second.Month ?? '2.TimePeriods'}</span>
					<span>↓</span>
				</button>
				{#await getData(2)}
				<p>loading...</p>
				{:then data}
				<button class="btn variant-filled w-48 justify-between" use:popup={secondSelectBuilding}>
					<span class="capitalize">{comparison.second.Building?.buildingname ?? '1.Building'}</span>
					<span>↓</span>
				</button>
				<button class="btn variant-filled w-48 justify-between" use:popup={secondSelectFloor}>
					<span class="capitalize">{comparison.second.Floor?.floorname ?? '1.Floor'}</span>
					<span>↓</span>
				</button>
				{/await}
			</div>
		</div>
	</div>

	<div class="select-type">
		<div class="flex align-item-center justify-items-cente">
			<RadioGroup active="variant-filled-primary" hover="hover:variant-soft-primary">
				<RadioItem bind:group={comparison.showType} name="end" value="Days"
					>Bookings of Days</RadioItem
				>
				<RadioItem bind:group={comparison.showType} name="end" value="Data"
					>Data from Time</RadioItem
				>
			</RadioGroup>
		</div>
	</div>

	<div class="first-com">
		{#if !comparison.first.Month || !comparison.first.Year}
			<div class="flex justify-items-center align-middle">
				<p>Select Time</p>
			</div>
		{/if}
		{#key comparison.first}
			{#if comparison.first.Year !== null && comparison.first.Month !== null}
				{#if comparison.showType === 'Days'}
					<ComparisonBarChart
						year={comparison.first.Year.toString() ?? ''}
						selectedTimePeriod={comparison.first.Month.toString() ?? ''}
						building={comparison.first.Building}
						floor={comparison.first.Floor}
					/>
				{:else if comparison.showType === 'Data'}
					<DataChart
						year={comparison.first.Year.toString() ?? ''}
						selectedTimePeriod={comparison.first.Month.toString() ?? ''}
						building={comparison.first.Building}
						floor={comparison.first.Floor}
					/>
				{/if}
			{/if}
		{/key}
	</div>

	<div class="second-com">
		{#if !comparison.second.Month || !comparison.second.Year}
			<div class="flex justify-items-center align-middle">
				<p>Select Time</p>
			</div>
		{/if}
		{#key comparison.second}
			{#if comparison.second.Year !== null && comparison.second.Month !== null}
				{#if comparison.showType === 'Days'}
					<ComparisonBarChart
						year={comparison.second.Year.toString() ?? ''}
						selectedTimePeriod={comparison.second.Month.toString() ?? ''}
						building={comparison.second.Building}
						floor={comparison.second.Floor}
					/>
				{:else if comparison.showType === 'Data'}
					<DataChart
						year={comparison.second.Year.toString() ?? ''}
						selectedTimePeriod={comparison.second.Month.toString() ?? ''}
						building={comparison.second.Building}
						floor={comparison.second.Floor}
					/>
				{/if}
			{/if}
		{/key}
	</div>
</div>

<div class="card w-48 shadow-xl py-2" data-popup="firstSelectYear">
	<ListBox rounded="rounded-none">
		{#each years as year}
			<ListBoxItem bind:group={comparison.first.Year} name="medium" value={year}>{year}</ListBoxItem>
		{/each}
	</ListBox>
	<div class="arrow bg-surface-100-800-token" />
</div>

<div class="card w-48 shadow-xl py-2" data-popup="firstSelectMonth">
	<ListBox rounded="rounded-none">
		{#each selectableTimePeriods as month}
			<ListBoxItem bind:group={comparison.first.Month} name="medium" value={month}
				>{month}</ListBoxItem
			>
		{/each}
	</ListBox>
</div>
<div class="card w-48 shadow-xl py-2" data-popup="firstSelectBuilding">
	<ListBox rounded="rounded-none">
		{#each buildingsWithFloors as building}
			<ListBoxItem bind:group={comparison.first.Building} name="medium" value={building}
				>{building.buildingname}</ListBoxItem
			>
		{/each}
	</ListBox>
</div>
<div class="card w-48 shadow-xl py-2" data-popup="firstSelectFloor">
	<ListBox rounded="rounded-none">
	{#each comparison.first.Building?.floors ?? [] as floor}
			<ListBoxItem bind:group={comparison.first.Floor} name="medium" value={floor}
				>{floor.floorname}</ListBoxItem
			>
		{/each}
	</ListBox>
</div>

<div class="card w-48 shadow-xl py-2" data-popup="secondSelectYear">
	<ListBox rounded="rounded-none">
		{#each years as year}
			<ListBoxItem bind:group={comparison.second.Year} name="medium" value={year}>{year}</ListBoxItem
			>
		{/each}
	</ListBox>
	<div class="arrow bg-surface-100-800-token" />
</div>

<div class="card w-48 shadow-xl py-2" data-popup="secondSelectMonth">
	<ListBox rounded="rounded-none">
		{#each selectableTimePeriods as month}
			<ListBoxItem bind:group={comparison.second.Month} name="medium" value={month}
				>{month}</ListBoxItem
			>
		{/each}
	</ListBox>
	<div class="arrow bg-surface-100-800-token" />
</div>

<div class="card w-48 shadow-xl py-2" data-popup="secondSelectBuilding">
	<ListBox rounded="rounded-none">
		{#each buildingsWithFloors as building}
			<ListBoxItem bind:group={comparison.second.Building} name="medium" value={building}
				>{building.buildingname}</ListBoxItem
			>
		{/each}
	</ListBox>
</div>
<div class="card w-48 shadow-xl py-2" data-popup="secondSelectFloor">
	<ListBox rounded="rounded-none">
	{#each comparison.second.Building?.floors ?? [] as floor}
			<ListBoxItem bind:group={comparison.second.Floor} name="medium" value={floor}
				>{floor.floorname}</ListBoxItem
			>
		{/each}
	</ListBox>
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		grid-template-rows: 1fr 5fr 1fr 1fr 5fr;
		row-gap: 10px;
		gap: 10px 10px;
		grid-auto-flow: row;
		grid-template-areas:
			'Title Title'
			'first-Dia second-Dia'
			'first-sel second-sel'
			'select-type select-type'
			'first-com second-com';

		padding-left: 5%;
		padding-right: 5%;
		padding-top: 5px;
		width: 100vw;
		height: 100vh;
	}

	.Title {
		grid-area: Title;
		background-color: #f1f1f1;
		height: 50px;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.first-Dia {
		grid-area: first-Dia;
		background-color: #f1f1f1;
	}

	.second-Dia {
		grid-area: second-Dia;
		background-color: #f1f1f1;
		width: 100%;
	}

	.first-sel {
		grid-area: first-sel;
		background-color: #f1f1f1;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.second-sel {
		grid-area: second-sel;
		background-color: #f1f1f1;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.select-type {
		grid-area: select-type;
		background-color: #f1f1f1;
		width: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.first-com {
		grid-area: first-com;
		background-color: #f1f1f1;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.second-com {
		grid-area: second-com;
		background-color: #f1f1f1;
		width: 100%;
		height: 100%;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.ComparisonBarChart {
		width: 100%;
		height: 100%;
	}
</style>
