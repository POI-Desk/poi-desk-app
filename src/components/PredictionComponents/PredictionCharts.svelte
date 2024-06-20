<script lang="ts">
	import { offset } from '@floating-ui/dom';
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

	// <block:external:2>
	const getOrCreateTooltip = (chart: any) => {
		let tooltipEl = chart.canvas.parentNode.querySelector('div');

		if (!tooltipEl) {
			tooltipEl = document.createElement('div');
			tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
			tooltipEl.style.borderRadius = '3px';
			tooltipEl.style.color = 'white';
			tooltipEl.style.opacity = 1;
			tooltipEl.style.pointerEvents = 'none';
			tooltipEl.style.offset = '10px 100px';
			tooltipEl.style.position = 'absolute';
			tooltipEl.style.transform = 'translate(-50%, 0)';
			tooltipEl.style.transition = 'all .1s ease';

			const table = document.createElement('table');
			table.style.margin = '0px';

			tooltipEl.appendChild(table);
			chart.canvas.parentNode.appendChild(tooltipEl);
		}

		return tooltipEl;
	};

	const externalTooltipHandler = (context: any) => {
		// Tooltip Element
		const { chart, tooltip } = context;
		const tooltipEl = getOrCreateTooltip(chart);

		// Hide if no tooltip
		if (tooltip.opacity === 0) {
			tooltipEl.style.opacity = 0;
			return;
		}

		// Set Text
		if (tooltip.body) {
			const titleLines = tooltip.title || [];
			const bodyLines = tooltip.body.map((b: any) => b.lines);

			const tableHead = document.createElement('thead');

			titleLines.forEach((title: any) => {
				const tr = document.createElement('tr');
				tr.style.borderWidth = '0';

				const th = document.createElement('th');
				th.style.borderWidth = '0';
				const text = document.createTextNode(title);

				th.appendChild(text);
				tr.appendChild(th);
				tableHead.appendChild(tr);
			});

			const tableBody = document.createElement('tbody');
			if (bodyLines.length > 1) {
				let sum = 0;
				for (let i = 0; i < bodyLines.length; i++) {
					if (bodyLines[i][0].includes(':')) {
						let parts = bodyLines[i][0].split(':');
						sum += parseInt(parts[1].trim(), 10);
					}
				}
				bodyLines.push([`sum: ${sum}`]);
				tooltip.labelColors.push({
					backgroundColor: 'rgb(0, 0, 0)',
					borderColor: 'rgba(0,0,0,0.1)',
					borderDash: undefined,
					borderDashOffset: undefined,
					borderRadius: 0,
					borderWidth: 1
				});
			}
			bodyLines.forEach((body: any, i: any) => {
				const colors = tooltip.labelColors[i];
				const span = document.createElement('span');
				span.style.background = colors.backgroundColor;
				span.style.borderColor = colors.borderColor;
				span.style.borderWidth = '2px';
				span.style.marginRight = '10px';
				span.style.height = '10px';
				span.style.width = '10px';
				span.style.display = 'inline-block';

				const tr = document.createElement('tr');
				tr.style.backgroundColor = 'inherit';
				tr.style.borderWidth = '0';

				const td = document.createElement('td');
				td.style.borderWidth = '0';

				const text = document.createTextNode(body);

				td.appendChild(span);
				td.appendChild(text);
				tr.appendChild(td);
				tableBody.appendChild(tr);
			});

			const tableRoot = tooltipEl.querySelector('table');

			// Remove old children
			while (tableRoot.firstChild) {
				tableRoot.firstChild.remove();
			}

			// Add new children
			tableRoot.appendChild(tableHead);
			tableRoot.appendChild(tableBody);
		}

		const { offsetLeft: positionX, offsetTop: positionY } = chart.canvas;

		// Display, position, and set styles for font
		tooltipEl.style.opacity = 1;
		tooltipEl.style.left = positionX + tooltip.caretX + 'px';
		tooltipEl.style.top = positionY + tooltip.caretY + 'px';
		tooltipEl.style.font = tooltip.options.bodyFont.string;
		tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
	};
	// </block:external>

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
						display: false,
						text: 'Predictions'
					},
					tooltip: {
						enabled: false,
						position: 'nearest',
						external: externalTooltipHandler
					}
				}
			}
		});
	});
</script>

<canvas bind:this={predictionCanvas} id="myChart" />