<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onMount } from 'svelte';
    import type { AnalysisResult, AnalysisComparisonInfo } from '$lib/types/analysisResultType';
    import { user } from '$lib/userStore.js';
    import { MonthlyBookingsByLocation, MonthlyBookingsByBuilding, MonthlyBookingsByFloor, QuarterlyBookingsByLocation , QuarterlyBookingsByBuilding, QuarterlyBookingsByFloor , YearlyBookingsByLocation, YearlyBookingsByBuilding, YearlyBookingsByFloor } from '$lib/queries/analysisQueries';
	import type { Building } from '$lib/types/buildingType';
    import type {Floor} from '$lib/types/floorType'
   

    export let year: string;
    export let selectedTimePeriod: string;
    export let building: Building | null;
    export let floor :Floor | null;

    interface MonthDictionary {
        [key: string]: number;
    }

    export const CHART_COLORS = {
        red: 'rgb(255, 99, 132)',
        orange: 'rgb(255, 159, 64)',
        yellow: 'rgb(255, 205, 86)',
        green: 'rgb(75, 192, 192)',
        blue: 'rgb(54, 162, 235)',
        purple: 'rgb(153, 102, 255)',
        grey: 'rgb(201, 203, 207)'
    };

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
        All: 17,
    };


    let ctx;
    let chartCanvas: any;
    let chartValues: [Number?] = [];
    let morningValues: [Number?] = [];
  let afternoonValues: [Number?] = [];
    let chartLabels: [String?] = [];

    let analysisResult: AnalysisResult = {
        month: "",
        amountOfDesks: 0,
        highestBookings: 0,
        averageBookings: 0,
        lowestBookings: 0,
        totalBooking: 0,
    };

    async function loadData() {
        switch (true) {
            case  monthDictionary[selectedTimePeriod] <= 12:
            {
                let result;
                let monthlyBookingResult;
                
                if((building?.buildingid == '' || building == null) && (floor?.floorid == '' || floor == null)){
                    result = await MonthlyBookingsByLocation.fetch(
                        { variables: { year: year, month: monthDictionary[selectedTimePeriod].toString(), location: $user.location?.pk_locationid || ""} });
                    monthlyBookingResult = result.data?.getMonthlyBookingByLocation;
                }
                else if(building && ( floor?.floorid == '' || floor == null)){
                    result = await MonthlyBookingsByBuilding.fetch(
                        { variables: { year: year, month: monthDictionary[selectedTimePeriod].toString(), building: building.buildingid} });
                    monthlyBookingResult = result.data?.getMonthlyBookingByBuilding;
                }
                else if(building && floor){
                    result = await MonthlyBookingsByFloor.fetch(
                        { variables: { year: year, month: monthDictionary[selectedTimePeriod].toString(), floor: floor.floorid} });
                    monthlyBookingResult = result.data?.getMonthlyBookingByFloor;
                    }
                if (result) {
                    monthlyBookingResult?.dailyBookings?.forEach((element: {day: String, totalBookings: Number, morning: Number, afternoon: Number} | null) => {
                        if (element?.totalBookings != 0) {
                            chartLabels.push(element?.day!);
                            morningValues.push(element?.morning!);
                            afternoonValues.push(element?.afternoon!);
                            chartValues.push(element?.totalBookings!);
                        }
                    });
                }
                break;
            }
            case monthDictionary[selectedTimePeriod] >= 13 && monthDictionary[selectedTimePeriod] <= 16:
            {
                let result;
                let quarterlyBookingResult;
                if(!building && !floor){
                    result = await QuarterlyBookingsByLocation.fetch(
                        { variables: { year: year, quarter: monthDictionary[selectedTimePeriod]-12, location: $user.location?.pk_locationid || "" } });
                    quarterlyBookingResult = result.data?.getQuarterlyBookingByLocation;
                    }
                else if(building && !floor){
                    result = await QuarterlyBookingsByBuilding.fetch(
                        { variables: { year: year, quarter: monthDictionary[selectedTimePeriod]-12, building: building.buildingid} });
                    quarterlyBookingResult = result.data?.getQuarterlyBookingByBuilding;
                }
                else if(building && floor){
                    result = await QuarterlyBookingsByFloor.fetch(
                        { variables: { year: year, quarter: monthDictionary[selectedTimePeriod]-12, floor: floor.floorid} });
                    quarterlyBookingResult = result.data?.getQuarterlyBookingByFloor;
                }
                if (result) {
                    quarterlyBookingResult?.monthlyBookings?.forEach((element: { month: String, dailyBookings: any } | null) => {
                        if (element?.dailyBookings != 0) {
                            element?.dailyBookings.forEach((e: {day: String, totalBookings: Number, morning: Number, afternoon: Number} | null) => {
                            if (e?.totalBookings != 0) {
                                chartLabels.push(e?.day!);
                                morningValues.push(e?.morning!);
                                afternoonValues.push(e?.afternoon!);
                                chartValues.push(e?.totalBookings!);
                            }
                        })
                        }
                    });
                };
                break;
            }
            case monthDictionary[selectedTimePeriod] === 17:
            {
                let result;
                let yearlyBookingResult
                if(!building && !floor){
                    result = await YearlyBookingsByLocation.fetch(
                        { variables: { year: year, location: $user.location?.pk_locationid || "" } });
                    yearlyBookingResult = result.data?.getYearlyBookingByLocation;
                    }
                else if(building && !floor){
                    result = await YearlyBookingsByBuilding.fetch(
                        { variables: { year: year, building: building.buildingid} });
                    yearlyBookingResult = result.data?.getYearlyBookingByBuilding;
                }
                else if(building && floor){
                    result = await YearlyBookingsByFloor.fetch(
                        { variables: { year: year, floor: floor.floorid} });
                    yearlyBookingResult = result.data?.getYearlyBookingByFloor;
                }
                if (result) {
                    yearlyBookingResult?.quarterlyBookings?.forEach((element: { quarter: number, monthlyBookings: any } | null) => {
                        if (element?.monthlyBookings != 0) {
                            element?.monthlyBookings.forEach((e1: { month: String, dailyBookings: any } | null) => {
                            e1?.dailyBookings.forEach((e: {day: String, totalBookings: Number, morning: Number, afternoon: Number} | null) => {
                            if (e?.totalBookings != 0) {
                                chartLabels.push(e?.day!);
                                morningValues.push(e?.morning!);
                                afternoonValues.push(e?.afternoon!);
                                chartValues.push(e?.totalBookings!);
                            }
                        })
                        })
                    }
                    });
                };
                break;
            }
            default:
                return "Invalid section";
            }
            
        
    }

    let monthData = {
        labels: chartLabels,
        datasets: [{
            label: 'morning',
            data: morningValues,
            backgroundColor: CHART_COLORS.red,
            borderWidth: 1
        },
        {
            label: 'afternoon',
            data: afternoonValues,
            backgroundColor: CHART_COLORS.blue,
            borderWidth: 1
        }]
    };

    onMount(async () => {
        if( year === "" || selectedTimePeriod === "")
            return;
        await loadData();
        ctx = chartCanvas.getContext('2d');
        var chart = new Chart(ctx,  {
        type: 'bar',
        data: monthData,
        options: {
            plugins: {
                title: {
                    display: true,
                    text: "Total amount of Seats Booked"

                },
            },
            responsive: true,
            scales: {
                x: {
                    stacked: true,
                },
                y: {
                    stacked: true,
                },
            },
        }
        });
    });
</script>

<canvas bind:this={chartCanvas} id="myChart"></canvas>