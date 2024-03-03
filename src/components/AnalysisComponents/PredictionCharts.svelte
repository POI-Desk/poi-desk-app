<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';

	export const CHART_COLORS = {
		red: 'rgb(255, 99, 132)',
		orange: 'rgb(255, 159, 64)',
		yellow: 'rgb(255, 205, 86)',
		green: 'rgb(75, 192, 192)',
		blue: 'rgb(54, 162, 235)',
		purple: 'rgb(153, 102, 255)',
		grey: 'rgb(201, 203, 207)'
	};

	export let data: any;
	let predictionCanvas: any;

	onMount(() => {
		let ctx = predictionCanvas.getContext('2d');
		let myChart = new Chart(ctx, {
			type: 'line',
			data: data,
			options: {
				responsive: true,
				plugins: {
					legend: {
						position: 'top'
					},
					title: {
						display: true,
						text: 'Chart.js Line Chart'
					}
				}
			}
		});
	});
</script>

<canvas bind:this={predictionCanvas} id="myChart" />
