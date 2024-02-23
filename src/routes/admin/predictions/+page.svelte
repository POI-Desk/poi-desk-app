<script lang="ts">
	import { onMount } from 'svelte';
	import { IdentifierType } from './../../../../$houdini/graphql/enums.js';
	import { getMonthlyBookingPrediction } from '$lib/queries/predictionQueries';
  import Chart from 'chart.js/auto';
  import type { MonthlyPrediction } from '$lib/types/predictionType';

  export const CHART_COLORS = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(75, 192, 192)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
  };

  let monthlyPredictions: MonthlyPrediction[] = [];

  async function loadData() {
    let result = await getMonthlyBookingPrediction.fetch(
      { variables: { identifier: "64794c3f-64ee-48c9-ac7b-474813cb6597", identifierType: IdentifierType.Floor} });
    if(result){
    let monthlyBookingPredictions = result.data?.getMonthlyBookingPrediction;
    monthlyBookingPredictions?.forEach((element) => {
      if (element) {
        monthlyPredictions.push({
          month: element.month,
          totalBookings: element.totalBookings,
          morning_highestBooking: element.morning_highestBooking,
          morningAverageBooking: element.morningAverageBooking,
          morning_lowestBooking: element.morning_lowestBooking,
          afternoon_highestBooking: element.afternoon_highestBooking,
          afternoonAverageBooking: element.afternoonAverageBooking,
          afternoon_lowestBooking: element.afternoon_lowestBooking,
        })
      }
    });
  }
  }

  let x: any = {
    months: monthlyPredictions.map((m) => m.month),
    totalBookings: monthlyPredictions.map((m) => m.totalBookings),
    morning_highestBooking: monthlyPredictions.map((m) => m.morning_highestBooking),
    morningAverageBooking: monthlyPredictions.map((m) => m.morningAverageBooking),
    morning_lowestBooking: monthlyPredictions.map((m) => m.morning_lowestBooking),
    afternoon_highestBooking: monthlyPredictions.map((m) => m.afternoon_highestBooking),
    afternoonAverageBooking: monthlyPredictions.map((m) => m.afternoonAverageBooking),
    afternoon_lowestBooking: monthlyPredictions.map((m) => m.afternoon_lowestBooking),
  }

    let ctx;
    let chartCanvas: any;
    /*let data = {
        labels: x.month,
        datasets: [{
            label: 'totalBookings',
            data: x.totalBookings,
            backgroundColor: CHART_COLORS.red,
            borderWidth: 1
        },
        {
            label: 'morning_highestBooking',
            data: x.morning_highestBooking,
            backgroundColor: CHART_COLORS.orange,
            borderWidth: 1
        },
      {
            label: 'morningAverageBooking',
            data: x.morningAverageBooking,
            backgroundColor: CHART_COLORS.purple,
            borderWidth: 1
        },
      {
            label: 'morning_lowestBooking',
            data: x.morning_lowestBooking,
            backgroundColor: CHART_COLORS.blue,
            borderWidth: 1
        },
      {
            label: 'afternoon_highestBooking',
            data: x.afternoon_highestBooking,
            backgroundColor: CHART_COLORS.green,
            borderWidth: 1
        },
      {
            label: 'afternoonAverageBooking',
            data: x.afternoonAverageBooking,
            backgroundColor: CHART_COLORS.yellow,
            borderWidth: 1
        },
      {
            label: 'afternoon_lowestBooking',
            data: x.afternoon_lowestBooking,
            backgroundColor: CHART_COLORS.grey,
            borderWidth: 1
        },]
    };*/
  onMount(async () => {
    await loadData();
    ctx = chartCanvas.getContext('2d');
    var chart = new Chart(ctx,  {
    type: 'line',
    data: {
        labels: monthlyPredictions.map((m) => m.month),
        datasets: [{
            label: 'totalBookings',
            data: monthlyPredictions.map((m) => m.totalBookings),
            backgroundColor: CHART_COLORS.red,
            borderColor: CHART_COLORS.red,
        },
        {
            label: 'morning_highestBooking',
            data: monthlyPredictions.map((m) => m.morning_highestBooking),
            backgroundColor: CHART_COLORS.orange,
            borderColor: CHART_COLORS.orange,
        },
      {
            label: 'morningAverageBooking',
            data: monthlyPredictions.map((m) => m.morningAverageBooking),
            backgroundColor: CHART_COLORS.purple,
            borderColor: CHART_COLORS.purple,
        },
      {
            label: 'morning_lowestBooking',
            data: monthlyPredictions.map((m) => m.morning_lowestBooking),
            backgroundColor: CHART_COLORS.blue,
            borderColor: CHART_COLORS.blue,
        },
      {
            label: 'afternoon_highestBooking',
            data: monthlyPredictions.map((m) => m.afternoon_highestBooking),
            backgroundColor: CHART_COLORS.green,
            borderColor: CHART_COLORS.green,
        },
      {
            label: 'afternoonAverageBooking',
            data: monthlyPredictions.map((m) => m.afternoonAverageBooking),
            backgroundColor: CHART_COLORS.yellow,
            borderColor: CHART_COLORS.yellow,
        },
      {
            label: 'afternoon_lowestBooking',
            data: monthlyPredictions.map((m) => m.afternoon_lowestBooking),
            backgroundColor: CHART_COLORS.grey,
            borderColor: CHART_COLORS.grey,
        },]
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: 'top',
        },
        title: {
          display: true,
          text: 'Chart.js Line Chart'
        }
      }
    }
  });
  /*console.log({
        labels: x.month,
        datasets: [{
            label: 'totalBookings',
            data: x.totalBookings,
            backgroundColor: CHART_COLORS.red,
            borderWidth: 1
        },
        {
            label: 'morning_highestBooking',
            data: x.morning_highestBooking,
            backgroundColor: CHART_COLORS.red,
            borderWidth: 1
        },
      {
            label: 'morningAverageBooking',
            data: x.morningAverageBooking,
            backgroundColor: CHART_COLORS.red,
            borderWidth: 1
        },
      {
            label: 'morning_lowestBooking',
            data: x.morning_lowestBooking,
            backgroundColor: CHART_COLORS.red,
            borderWidth: 1
        },
      {
            label: 'afternoon_highestBooking',
            data: x.afternoon_highestBooking,
            backgroundColor: CHART_COLORS.red,
            borderWidth: 1
        },
      {
            label: 'afternoonAverageBooking',
            data: x.afternoonAverageBooking,
            backgroundColor: CHART_COLORS.red,
            borderWidth: 1
        },
      {
            label: 'afternoon_lowestBooking',
            data: x.afternoon_lowestBooking,
            backgroundColor: CHART_COLORS.red,
            borderWidth: 1
        },]
    });*/
  });
</script>

<canvas bind:this={chartCanvas} id="myChart"></canvas>