<script lang="ts">
	import { onMount } from 'svelte';
	import type { AnalysisData } from '$lib/types/analysisResultType';
	import { user } from '$lib/stores/userStore';
	import {
		MonthlyBookingDataByLocation,
		MonthlyBookingDataByBuilding,
		MonthlyBookingDataByFloor,
		QuarterlyBookingDataByLocation,
		QuarterlyBookingDataByBuilding,
		QuarterlyBookingDataByFloor,
		YearlyBookingDataByLocation,
		YearlyBookingDataByBuilding,
		YearlyBookingDataByFloor
	} from '$lib/queries/analysisQueries';
	import type { Building } from '$lib/types/buildingType';
	import type { Floor } from '$lib/types/floorType';
	export let year: string;
	export let selectedTimePeriod: string;
	export let building: Building | null;
	export let floor: Floor | null;
	console.log(year, selectedTimePeriod, building, floor);

	interface MonthDictionary {
		[key: string]: number;
	}

	const monthDictionary: MonthDictionary = {
		January: 1,
		February: 2,
		March: 3,
		April: 4,
		May: 5,
		June: 6,
		July: 7,
		August: 8,
		September: 9,
		October: 10,
		November: 11,
		December: 12,
		Q1: 13,
		Q2: 14,
		Q3: 15,
		Q4: 16,
		All: 17
	};
	let analysisData2: AnalysisData = {
		time: 'december',
		total: 2314,
		days: 21,
		amountOfDesks: 435,
		morning_highestBooking: {
			days: '2023-12-02',
			morning: 341,
			afternoon: 324
		},
		morningAverageBooking: 187.5,
		morning_lowestBooking: {
			days: '2023-12-14',
			morning: 23,
			afternoon: 124
		},
		afternoon_highestBooking: {
			days: '2023-12-23',
			morning: 123,
			afternoon: 421
		},
		afternoonAverageBooking: 210.5,
		afternoon_lowestBooking: {
			days: '2023-12-06',
			morning: 151,
			afternoon: 94
		}
	};
	let returnedNull: Boolean = false;
	let analysisData: AnalysisData;
	async function loadData() {
		switch (true) {
			case monthDictionary[selectedTimePeriod] <= 12: {
				let result;
				let monthlyBookingResult;
				if (
					(building?.buildingid == '' || building == null) &&
					(floor?.floorid == '' || floor == null)
				) {
					console.log($user);
					result = await MonthlyBookingDataByLocation.fetch({
						variables: {
							year: year,
							month: monthDictionary[selectedTimePeriod].toString(),
							location: $user.location?.pk_locationid || ''
						}
					});
					monthlyBookingResult = result.data?.getMonthlyBookingByLocation;
				} else if (building && (floor?.floorid == '' || floor == null)) {
					result = await MonthlyBookingDataByBuilding.fetch({
						variables: {
							year: year,
							month: monthDictionary[selectedTimePeriod].toString(),
							building: building.buildingid
						}
					});
					monthlyBookingResult = result.data?.getMonthlyBookingByBuilding;
				} else if (building && floor) {
					result = await MonthlyBookingDataByFloor.fetch({
						variables: {
							year: year,
							month: monthDictionary[selectedTimePeriod].toString(),
							floor: floor.floorid
						}
					});
					monthlyBookingResult = result.data?.getMonthlyBookingByFloor;
				}
				if (monthlyBookingResult == null || monthlyBookingResult?.afternoon_lowestBooking === null) {
					returnedNull = true;
					return;
				}
				if (result) {
					analysisData = {
						time: monthlyBookingResult?.month!,
						total: monthlyBookingResult?.total!,
						days: monthlyBookingResult?.days!,
						amountOfDesks: monthlyBookingResult?.amountOfDesks!,
						morning_highestBooking: {
							days: monthlyBookingResult?.morning_highestBooking?.day!,
							morning: monthlyBookingResult?.morning_highestBooking?.morning!,
							afternoon: monthlyBookingResult?.morning_highestBooking?.afternoon!
						},
						morningAverageBooking: monthlyBookingResult?.morningAverageBooking!,
						morning_lowestBooking: {
							days: monthlyBookingResult?.morning_lowestBooking?.day!,
							morning: monthlyBookingResult?.morning_lowestBooking?.morning!,
							afternoon: monthlyBookingResult?.morning_lowestBooking?.afternoon!
						},
						afternoon_highestBooking: {
							days: monthlyBookingResult?.afternoon_highestBooking?.day!,
							morning: monthlyBookingResult?.afternoon_highestBooking?.morning!,
							afternoon: monthlyBookingResult?.afternoon_highestBooking?.afternoon!
						},
						afternoonAverageBooking: monthlyBookingResult?.afternoonAverageBooking!,
						afternoon_lowestBooking: {
							days: monthlyBookingResult?.afternoon_lowestBooking?.day!,
							morning: monthlyBookingResult?.afternoon_lowestBooking?.morning!,
							afternoon: monthlyBookingResult?.afternoon_lowestBooking?.afternoon!
						}
					};
				}
				break;
			}
			case monthDictionary[selectedTimePeriod] >= 13 && monthDictionary[selectedTimePeriod] <= 16: {
				let result;
				let quarterlyBookingResult;
				if (
					(building?.buildingid == '' || building == null) &&
					(floor?.floorid == '' || floor == null)
				) {
					console.log($user);
					result = await QuarterlyBookingDataByLocation.fetch({
						variables: {
							year: year,
							quarter: monthDictionary[selectedTimePeriod] - 12,
							location: $user.location?.pk_locationid || ''
						}
					});
					quarterlyBookingResult = result.data?.getQuarterlyBookingByLocation;
				} else if (building && (floor?.floorid == '' || floor == null)) {
					result = await QuarterlyBookingDataByBuilding.fetch({
						variables: {
							year: year,
							quarter: monthDictionary[selectedTimePeriod] - 12,
							building: building.buildingid
						}
					});
					quarterlyBookingResult = result.data?.getQuarterlyBookingByBuilding;
				} else if (building && floor) {
					result = await QuarterlyBookingDataByFloor.fetch({
						variables: {
							year: year,
							quarter: monthDictionary[selectedTimePeriod] - 12,
							floor: floor.floorid
						}
					});
					quarterlyBookingResult = result.data?.getQuarterlyBookingByFloor;
				}
				if (quarterlyBookingResult === null || quarterlyBookingResult?.afternoon_lowestBooking === null) {
					returnedNull = true;
					return;
				}
				if (quarterlyBookingResult) {
					analysisData = {
						time: quarterlyBookingResult?.year! + '-Q' + quarterlyBookingResult?.quarter!.toString,
						total: quarterlyBookingResult?.total!,
						days: quarterlyBookingResult?.days!,
						amountOfDesks: quarterlyBookingResult?.amountOfDesks!,
						morning_highestBooking: {
							days: quarterlyBookingResult?.morning_highestBooking?.day!,
							morning: quarterlyBookingResult?.morning_highestBooking?.morning!,
							afternoon: quarterlyBookingResult?.morning_highestBooking?.afternoon!
						},
						morningAverageBooking: quarterlyBookingResult?.morningAverageBooking!,
						morning_lowestBooking: {
							days: quarterlyBookingResult?.morning_lowestBooking?.day!,
							morning: quarterlyBookingResult?.morning_lowestBooking?.morning!,
							afternoon: quarterlyBookingResult?.morning_lowestBooking?.afternoon!
						},
						afternoon_highestBooking: {
							days: quarterlyBookingResult?.afternoon_highestBooking?.day!,
							morning: quarterlyBookingResult?.afternoon_highestBooking?.morning!,
							afternoon: quarterlyBookingResult?.afternoon_highestBooking?.afternoon!
						},
						afternoonAverageBooking: quarterlyBookingResult?.afternoonAverageBooking!,
						afternoon_lowestBooking: {
							days: quarterlyBookingResult?.afternoon_lowestBooking?.day!,
							morning: quarterlyBookingResult?.afternoon_lowestBooking?.morning!,
							afternoon: quarterlyBookingResult?.afternoon_lowestBooking?.afternoon!
						}
					};
				}
				break;
			}
			case monthDictionary[selectedTimePeriod] === 17: {
				let result;
				let yearlyBookingResult;
				if (
					(building?.buildingid == '' || building == null) &&
					(floor?.floorid == '' || floor == null)
				) {
					console.log($user);
					result = await YearlyBookingDataByLocation.fetch({
						variables: {
							year: year,
							location: $user.location?.pk_locationid || ''
						}
					});
					yearlyBookingResult = result.data?.getYearlyBookingByLocation;
				} else if (building && (floor?.floorid == '' || floor == null)) {
					result = await YearlyBookingDataByBuilding.fetch({
						variables: {
							year: year,
							building: building.buildingid
						}
					});
					yearlyBookingResult = result.data?.getYearlyBookingByBuilding;
				} else if (building && floor) {
					result = await YearlyBookingDataByFloor.fetch({
						variables: {
							year: year,
							floor: floor.floorid
						}
					});
					yearlyBookingResult = result.data?.getYearlyBookingByFloor;
				}
				if (yearlyBookingResult == null || yearlyBookingResult?.afternoon_lowestBooking === null) {
					returnedNull = true;
					return;
				}
				if (result) {
					analysisData = {
						time: yearlyBookingResult?.year!,
						total: yearlyBookingResult?.total!,
						days: yearlyBookingResult?.days!,
						amountOfDesks: yearlyBookingResult?.amountOfDesks!,
						morning_highestBooking: {
							days: yearlyBookingResult?.morning_highestBooking?.day!,
							morning: yearlyBookingResult?.morning_highestBooking?.morning!,
							afternoon: yearlyBookingResult?.morning_highestBooking?.afternoon!
						},
						morningAverageBooking: yearlyBookingResult?.morningAverageBooking!,
						morning_lowestBooking: {
							days: yearlyBookingResult?.morning_lowestBooking?.day!,
							morning: yearlyBookingResult?.morning_lowestBooking?.morning!,
							afternoon: yearlyBookingResult?.morning_lowestBooking?.afternoon!
						},
						afternoon_highestBooking: {
							days: yearlyBookingResult?.afternoon_highestBooking?.day!,
							morning: yearlyBookingResult?.afternoon_highestBooking?.morning!,
							afternoon: yearlyBookingResult?.afternoon_highestBooking?.afternoon!
						},
						afternoonAverageBooking: yearlyBookingResult?.afternoonAverageBooking!,
						afternoon_lowestBooking: {
							days: yearlyBookingResult?.afternoon_lowestBooking?.day!,
							morning: yearlyBookingResult?.afternoon_lowestBooking?.morning!,
							afternoon: yearlyBookingResult?.afternoon_lowestBooking?.afternoon!
						}
					};
				}
				break;
			}
			default:
				return 'Invalid section';
		}
	}
</script>

<!--{#await loadData()}
	<p>loading...</p>
{:then data}
	{#if returnedNull}
		<p class="p-2" style="font-size:40px;">No data available for Selection</p>
	{:else}
		<BarChart
			{data}
			title="Bookings {year} {selectedTimePeriod}  {building?.buildingid
				? `building: ${building?.buildingname}`
				: ''}  {floor?.floorid ? `floor: ${floor?.floorname}` : ''}"
		/>
	{/if}
{/await}-->

{#await loadData()}
	<p>loading...</p>
{:then d}
	{#if returnedNull}
		<p class="p-2" style="font-size:40px;">No data available for selection</p>
	{:else}
		<div class=" w-full h-full text-black rounded-3xl flex items-center justify-center p-2>">
			<div class="flex flex-col gap-2 w-full h-full">
				<div class="flex w-full h-1/2 gap-2 justify-around">
					<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
						<p class="p-2" style="font-size:60px;">{analysisData.days}</p>
						<p class="p-2" style="font-size:20px;">Days</p>
					</div>
					<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
						<p class="p-2" style="font-size:60px;">{analysisData.total}</p>
						<p class="p-2" style="font-size:20px;">Total</p>
					</div>
				</div>
				<div class="flex w-full h-1/2 gap-2 justify-around">
					<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
						<p class="p-2" style="font-size:60px;">{analysisData.morning_lowestBooking.morning}</p>
						<p class="p-2" style="font-size:20px;">Morning Min</p>
					</div>
					<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
						<p class="p-2" style="font-size:60px;">{analysisData.morningAverageBooking}</p>
						<p class="p-2" style="font-size:20px;">Morning Avg</p>
					</div>
					<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
						<p class="p-2" style="font-size:60px;">{analysisData.morning_highestBooking.morning}</p>
						<p class="p-2" style="font-size:20px;">Morning Max</p>
					</div>
				</div>
				<div class="flex w-full h-1/2 gap-2 justify-around">
					<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
						<p class="p-2" style="font-size:60px;">
							{analysisData.afternoon_lowestBooking.afternoon}
						</p>
						<p class="p-2" style="font-size:20px;">Afternoon Min</p>
					</div>
					<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
						<p class="p-2" style="font-size:60px;">{analysisData.afternoonAverageBooking}</p>
						<p class="p-2" style="font-size:20px;">Afternoon Avg</p>
					</div>
					<div class="w-1/2 h-full rounded-3xl flex items-center justify-center flex-col">
						<p class="p-2" style="font-size:60px;">
							{analysisData.afternoon_highestBooking.afternoon}
						</p>
						<p class="p-2" style="font-size:20px;">Afternoon Max</p>
					</div>
				</div>
			</div>
		</div>
	{/if}
{/await}
