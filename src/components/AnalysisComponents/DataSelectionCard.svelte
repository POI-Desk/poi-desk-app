<script lang="ts">
	import { building } from '$app/environment';
	import { user } from '$lib/userStore';
	import { getBuildingsWithFloors } from '$lib/queries/buildingQueries';
	import type { PopupSettings } from '@skeletonlabs/skeleton';
	import { YearsSinceStart } from '$lib/queries/analysisQueries';
	import ComparisonBarChart from '$components/AnalysisComponents/ComparisonBarChart.svelte';
	import DataChart from '$components/AnalysisComponents/DataChart.svelte';
	import type { AnaylsisSelection } from '$lib/types/analysisResultType';
	import { BarChart3, File, Info } from 'lucide-svelte';

	import { computePosition, autoUpdate, offset, shift, flip, arrow } from '@floating-ui/dom';
	import type { Building } from '$lib/types/buildingType';
	import type { Floor } from '$lib/types/floorType';
	import {
		storePopup,
		RadioGroup,
		RadioItem,
		ListBox,
		ListBoxItem,
		popup
	} from '@skeletonlabs/skeleton';
	storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

	export let buildings: Building[];

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

	/*$: selection.Building && changeFloor(selection.Building);

	function changeFloor(building: Building) {
		selection.Floor = building.floors[1];
    console.log(selection.Floor);
	}*/

	let years: string[] = ['2024'];

	async function getYears(): Promise<void> {
		const result = await YearsSinceStart.fetch();
		if (result) {
			years = result.data?.getAllYears ?? [];
		}
	}

	let selection: AnaylsisSelection = {
		Year: null,
		Month: null,
		Building: buildings[0] ?? null,
		Floor: buildings[0].floors[0] ?? null,
		showType: 'Days'
	};

	function onBuildingChange(event: any) {
		selection.Floor = selection.Building?.floors[0]!;
	}

	const yearSelection: PopupSettings = {
		event: 'focus-click',
		target: 'yearSelection',
		placement: 'right',
		closeQuery: '.listbox-item'
	};

	const monthSelection: PopupSettings = {
		event: 'focus-click',
		target: 'monthSelection',
		placement: 'right',
		closeQuery: '.listbox-item'
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
</script>

<div class=" h-full w-full flex flex-col rounded-3xl">
	<div class="flex flex-row w-full h-full p2">
		<div class="w-full h-full rounded-3xl flex items-center justify-center">
			<!--Diagramm-->
			<div class="w-1/2 h-full hite rounded-3xl flex items-center justify-center flex-row">
				<div class="w-full h-full bg-white rounded-3xl flex items-center justify-center flex-col">
					{#await getYears()}
						<p>loading...</p>
					{:then data}
						<p>Year:</p>
						<button class="btn variant-filled w-48 justify-between" use:popup={yearSelection}>
							<span class="capitalize">{selection.Year ?? 'Year'}</span>
							<span>↓</span>
						</button>
						<p>Time:</p>
						<button class="btn variant-filled w-48 justify-between" use:popup={monthSelection}>
							<span class="capitalize">{selection.Month ?? 'TimePeriod'}</span>
							<span>↓</span>
						</button>
						<p>Building:</p>
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
					{/await}
					<div class="flex w-full h-10 items-end h-full justify-center">
						<RadioGroup
							flex="flex"
							active="variant-filled-primary"
							hover="hover:variant-soft-primary"
							gap="gap-5"
						>
							<RadioItem bind:group={selection.showType} name="end" value="Days">
								<BarChart3 />
							</RadioItem>
							<RadioItem bind:group={selection.showType} name="end" value="Data">
								<File />
							</RadioItem>
						</RadioGroup>
					</div>
				</div>
			</div>

			<!--Data-->
			<div class="w-1/2 h-full bg-white rounded-3xl flex items-center justify-center p-2>">
				{#if !selection.Month || !selection.Year}
					<div class="flex justify-center items-center h-full">
						<p>Select Time</p>
					</div>
				{/if}
				{#key selection}
					{#if selection.Year !== null && selection.Month !== null}
						{#if selection.showType === 'Days'}
							<ComparisonBarChart
								year={selection.Year.toString() ?? ''}
								selectedTimePeriod={selection.Month.toString() ?? ''}
								building={selection.Building}
								floor={selection.Floor}
							/>
						{:else if selection.showType === 'Data'}
							<DataChart
								year={selection.Year.toString() ?? ''}
								selectedTimePeriod={selection.Month.toString() ?? ''}
								building={selection.Building}
								floor={selection.Floor}
							/>
						{/if}
					{/if}
				{/key}
			</div>
		</div>
	</div>
</div>

<div class="card w-48 shadow-xl py-2" data-popup="yearSelection">
	<ListBox rounded="rounded-none">
		{#each years as year}
			<ListBoxItem bind:group={selection.Year} name="medium" value={year}>{year}</ListBoxItem>
		{/each}
	</ListBox>
	<div class="arrow bg-surface-100-800-token" />
</div>
<div class="card w-48 shadow-xl py-2" data-popup="monthSelection">
	<ListBox rounded="rounded-none">
		{#each selectableTimePeriods as month}
			<ListBoxItem bind:group={selection.Month} name="medium" value={month}>{month}</ListBoxItem>
		{/each}
	</ListBox>
</div>

<div class="card w-48 shadow-xl py-2" data-popup="buildingSelection">
	<ListBox rounded="rounded-none">
		{#key buildings}
			{#each buildings as building}
				<ListBoxItem
					bind:group={selection.Building}
					name="medium"
					value={building}
					on:change={onBuildingChange}>{building.buildingname}</ListBoxItem
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
</div>
