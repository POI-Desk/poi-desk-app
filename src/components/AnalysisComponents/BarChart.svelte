<script lang="ts">
  import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
  import { user } from '$lib/userStore.js';

  export let data;
  export let title;
	let ctx;
	let chartCanvas: any;

  let barconfig: any = {
    type: 'bar',
    data: data,
    options: {
      plugins :{
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
  }

	onMount(async () => {
		  ctx = chartCanvas.getContext('2d');
			var chart = new Chart(ctx, barconfig);
	});
</script>


<canvas bind:this={chartCanvas} id="myChart"></canvas>
