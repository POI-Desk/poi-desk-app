<script lang="ts">
    import Chart from 'chart.js/auto';
    import { onMount } from 'svelte';
    import type { AnalysisResult, AnalysisComparisonInfo } from '$lib/types/analysisResultType';
    import { user } from '$lib/userStore.js';
    import { MonthlyBookings } from '$lib/queries/analysisQueries';

    export let title: String;
    export let year: String;
    export let month: String;
    console.log(year, month)

    const monthDictionary = {
        January: "1",
        February: "2",
        March: "3",
        April: "4",
        May: "5",
        June: "6",
        July: "7",
        August: "8",
        September: "9",
        October: "10",
        November: "11",
        December: "12",
    };


    let ctx;
    let chartCanvas;
    let chartValues: [Number?] = [];
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
        console.log(year, monthDictionary[month])
        const result = await MonthlyBookings.fetch(
            { variables: { year: year, month: monthDictionary[month], location: "b1a7f298-e727-457c-9a89-11bc50f76c81" } });//user.location
        if (result) {
            let monthlyBookingResult = result.data?.getMonthlyBooking;
            monthlyBookingResult?.dailyBookings?.forEach((element: { pk_day: String, totalBooking: Number } | null) => {
                if (element?.totalBooking != 0) {
                    chartValues.push(element?.totalBooking!);
                    chartLabels.push(element?.pk_day!);
                }
            });
            analysisResult = {
                month: monthlyBookingResult?.month!,
                amountOfDesks: 200,//monthlyBookingResult?.amountOfDesks!,
                highestBookings: monthlyBookingResult?.highestBookings!,
                averageBookings: monthlyBookingResult?.averageBookings!,
                lowestBookings: monthlyBookingResult?.lowestBookings!,
                totalBooking: monthlyBookingResult?.totalBooking!,
            };
        }
    }

    let monthData = {
        labels: chartLabels,
        datasets: [{
            label: 'Amount of Seats',
            data: chartValues,
            backgroundColor: 'rgb(0, 0, 255)',
            borderWidth: 1
        }]
    };

    onMount(async () => {
        if( year === "" || month === "")
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
                    stacked: false
                },
            },
        }
        });
    });
</script>

{#if year === "" || month === ""}
    <p>Sorry no data</p>    
{/if}

<canvas bind:this={chartCanvas} id="myChart"></canvas>





