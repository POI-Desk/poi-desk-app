<script lang="ts">
	import Table from '$components/MapComponents/Table.svelte';

	let height: number;
	let width: number;
	let row: number[] = Array.from({ length: 35 }, (_, index) => index);
	let column: number[] = Array.from({ length: 20 }, (_, index) => index);

	let tables: Table[] = [];

	const copyTable = (event: MouseEvent) =>{
		const grid: Element = document.getElementById('grid') as Element;
		const element = new Table({
			target: grid,
			props: {
				initX: event.clientX - grid.getBoundingClientRect().left,
				initY: event.clientY - grid.getBoundingClientRect().top,
				initMouseX: event.clientX,
				initMouseY: event.clientY,
				initDrag: true
			}
		});
		tables.push(element);
	}

</script>

<main class="scroll-lock">
	<button on:mousedown={copyTable} class="btn btn-primary">copy</button>
	<div style="width: 100vw; height: 100vh;">
		<div
		id="grid"
		style=" left: 50%; top: 50%; position: absolute; transform: translate(-50%, -50%);"
		>
			{#each row as y (y)}
				<div id={y.toString()} class="flex">
					{#each column as x (x)}
						<div
							id={y.toString() + x.toString()}
							class={(x + y) % 2 === 0 ? 'bg-gray-600' : 'bg-gray-500'}
							style="height: 25px; width: 25px;"
						/>
					{/each}
				</div>
			{/each}
		</div>
	</div>
</main>

<style>
	@import 'tailwindcss/base';
	@import 'tailwindcss/components';
	@import 'tailwindcss/utilities';

	.scroll-lock {
		overflow: hidden;
	}
</style>
