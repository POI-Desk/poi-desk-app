<!-- <script lang="ts">
  import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

	let chartValues = [200, 195, 113, 45];
	let chartLabels = ['Amount of Seats', 'MAX', 'AVG', 'MIN'];
	let ctx;
	let chartCanvas: any;

  const data = {
      labels: chartLabels,
      datasets: [{
        label: 'My First Dataset',
        data: chartValues,
        backgroundColor:[
          'rgb(0, 0, 0)',
          'rgb(255, 0, 0)',
          'rgb(0, 255, 0)',
          'rgb(0, 0, 255)',
        ] ,
      }]
    }

  let pieconfig: any = {
    type: 'doughnut',
    data: data,
    options: {
      plugins: {
        title: {
          display: true,
          text: 'Seats'
        }
      }
    }
  }

	onMount(async () => {
		  ctx = chartCanvas.getContext('2d');
			var chart = new Chart(ctx, pieconfig);

	});
</script>


<canvas bind:this={chartCanvas} id="myChart"></canvas> -->
