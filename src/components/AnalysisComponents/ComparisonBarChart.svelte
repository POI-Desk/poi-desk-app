<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onMount } from 'svelte';
    import type { AnalysisResult, AnalysisComparisonInfo } from '$lib/types/analysisResultType';
    import { user } from '$lib/userStore.js';
    import { MonthlyBookings, QuarterlyBookings, YearlyBookings } from '$lib/queries/analysisQueries';

    export let title: string;
    export let year: string;
    export let selectedTimePeriod: string;

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
                const result = await MonthlyBookings.fetch(
                    { variables: { year: year, month: monthDictionary[selectedTimePeriod].toString(), location: $user.location?.pk_locationid || "" } });
                if (result) {
                    let monthlyBookingResult = result.data?.getMonthlyBooking;
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
                const result = await QuarterlyBookings.fetch(
                    { variables: { year: year, quarter: selectedTimePeriod.toString(), location: $user.location?.pk_locationid || "" } });
                if (result) {
                    let quarterlyBookingResult = result.data?.getQuarterlyBooking;
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
                const result = await YearlyBookings.fetch(
                    { variables: { year: year, location: $user.location?.pk_locationid || "" } });
                if (result) {
                    let yearlyBookingResult = result.data?.getYearlyBooking;
                    yearlyBookingResult?.quarterlyBookings?.forEach((element: { quarter: String, monthlyBookings: any } | null) => {
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
            backgroundColor: 'rgb(0, 0, 255)',
            borderWidth: 1
        },
        {
            label: 'afternoon',
            data: afternoonValues,
            backgroundColor: 'rgb(255, 0, 255)',
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
                    text: title
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