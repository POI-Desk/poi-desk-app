<script lang="ts">
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	import { user } from '$lib/userStore.js';

	export let data: any;
	export let title: any;
	let ctx: any;
	let chartCanvas: any;

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

	let barconfig: any = {
		type: 'bar',
		data: data,
		options: {
			interaction: {
				intersect: false,
				mode: 'index'
			},
			plugins: {
				title: {
					display: true,
					text: title,
					font: {
						size: 20
						//family: 'Helvetica Neue'
					}
				},
				legend: {
					position: 'bottom',
					labels: {
						font: {
							size: 14
							//family: 'Helvetica Neue'
						}
					}
				},
				tooltip: {
					enabled: false,
					position: 'nearest',
					external: externalTooltipHandler
				}
			},
			responsive: true,
			scales: {
				x: {
					stacked: true
				},
				y: {
					stacked: true
				}
			}
		}
	};

	onMount(async () => {
		ctx = chartCanvas.getContext('2d');
		var chart = new Chart(ctx, barconfig);
	});
</script>
<canvas bind:this={chartCanvas} id="myChart" />