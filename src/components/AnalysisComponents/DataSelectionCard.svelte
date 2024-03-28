<script lang="ts">
	import { YearsSinceStart } from '$lib/queries/analysisQueries';
	import ComparisonBarChart from '$components/AnalysisComponents/ComparisonBarChart.svelte';
	import DataChart from '$components/AnalysisComponents/DataChart.svelte';
	import type { AnaylsisSelection } from '$lib/types/analysisResultType';
	import { BarChart3, File, Info } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Tabs from '$lib/components/ui/tabs';

	import type { Building } from '$lib/types/buildingType';

	import { Button } from '$lib/components/ui/button';
	//storePopup.set({ computePosition, autoUpdate, offset, shift, flip, arrow });

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

	let years: string[] = ['2024']; // hardcoded??? are you stupid? 🧮 -Tischler

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

	function onBuildingChange() {
		selection.Floor = selection.Building?.floors[0]!;
	}

	const amongus = 'w-40';
</script>

<div class=" h-full w-full flex flex-col rounded-3xl">
	<div class="flex flex-row w-full h-full p2">
		<div class="w-full h-full rounded-3xl flex items-center justify-center">
			<!--Diagramm-->
			<div class="w-1/2 h-full hite rounded-3xl flex items-center justify-center flex-row">
				<div
					class="w-full h-full bg-white rounded-3xl flex gap-2 items-center justify-center flex-col"
				>
					{#await getYears()}
						<p>loading...</p>
					{:then data}
						<p>Year:</p>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button class={amongus} builders={[builder]} variant="outline"
									>{selection.Year ?? 'Year'}</Button
								>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="w-56" side="right" sideOffset={20}>
								<DropdownMenu.Group>
									{#each years as year}
										<DropdownMenu.Item
											on:click={() => {
												selection.Year = year;
											}}>{year}</DropdownMenu.Item
										>
									{/each}
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
						<p>Time:</p>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button class={amongus} builders={[builder]} variant="outline"
									>{selection.Month ?? 'TimePeriod'}</Button
								>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="w-56" side="right" sideOffset={20}>
								<DropdownMenu.Group>
									{#each selectableTimePeriods as month}
										<DropdownMenu.Item
											on:click={() => {
												selection.Month = month;
											}}>{month}</DropdownMenu.Item
										>
									{/each}
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
						<p>Building:</p>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button class={amongus} builders={[builder]} variant="outline"
									>{selection.Building?.buildingname ?? 'Building'}</Button
								>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="w-56" side="right" sideOffset={20}>
								<DropdownMenu.Group>
									{#each buildings as building}
										<DropdownMenu.Item
											on:click={() => {
												selection.Building = building;
												onBuildingChange();
											}}>{building.buildingname}</DropdownMenu.Item
										>
									{/each}
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
						<p>Floor:</p>
						<DropdownMenu.Root>
							<DropdownMenu.Trigger asChild let:builder>
								<Button class={amongus} builders={[builder]} variant="outline"
									>{selection.Floor?.floorname ?? 'Floor'}</Button
								>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content class="w-56" side="right" sideOffset={20}>
								<DropdownMenu.Group>
									{#each selection.Building?.floors ?? [] as floor}
										<DropdownMenu.Item
											on:click={() => {
												selection.Floor = floor;
											}}>{floor.floorname}</DropdownMenu.Item
										>
									{/each}
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					{/await}
					<div class="flex w-full h-10 mt-10 justify-center">
						<Tabs.Root value="days">
							<Tabs.List>
								<Tabs.Trigger
									value="days"
									on:click={() => {
										selection.showType = 'Days';
									}}
								>
									<BarChart3 />
								</Tabs.Trigger>
								<Tabs.Trigger
									value="data"
									on:click={() => {
										selection.showType = 'Data';
									}}
								>
									<File />
								</Tabs.Trigger>
							</Tabs.List>
						</Tabs.Root>
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
