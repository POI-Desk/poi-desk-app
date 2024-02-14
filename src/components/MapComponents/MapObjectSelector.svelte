<script lang="ts">
	import { mapObjectType } from '$lib/map/props';
	import { getMapByFloor } from '$lib/queries/map';
	import type { TransformType } from '$lib/types/transformType';
	import { createEventDispatcher } from 'svelte';

	const dispatch = createEventDispatcher();

	//TODO: use type script
	function onCreate(e: MouseEvent, type: string) {
		if (!$getMapByFloor.data?.getMapByFloor || $getMapByFloor.fetching) return;
		dispatch('create', { e, type });
	}

	let selector: HTMLDivElement | null = null;
	let transform: TransformType = {
		x: 44,
		y: 0,
		width: 8,
		height: 50,
		rotation: 0
	};

	let left: HTMLDivElement | null = null;
	let grabbers: HTMLDivElement[] = [];

	function resize(element: HTMLElement) {
		let active: HTMLElement | null = null;

		left = document.createElement('div');
		left.title = 'west';
		left.classList.add('handle', 'handle-west', 'top-0');

		grabbers = [left];

		let initialTransform: TransformType | null = null,
			initialPos: { x: number; y: number } | null = null;

		grabbers.forEach((grabber) => {
			element.appendChild(grabber);
			grabber.addEventListener('mousedown', onMousedown);
		});

		function onMousedown(event: MouseEvent) {
			active = event.target as HTMLElement;

			initialTransform = { ...transform };
			initialPos = { x: (event.pageX / innerWidth) * 100, y: (event.pageY / innerWidth) * 100 };
		}

		function onMouseup(event: MouseEvent) {
			initialTransform = null;
			initialPos = null;
		}

		function onMove(event: MouseEvent) {
			if (!active || !initialPos) return;

			const direction = active.title;
			let delta: number = 0;

			if (direction.match('west')) {
				delta = initialPos!.x - (event.pageX / innerWidth) * 100;
				if (initialTransform!.width + delta < 5) return;
				if (initialTransform!.width + delta > 15) return;
				transform.width = initialTransform!.width + delta;
			}
		}

		window.addEventListener('mousemove', onMove);
		window.addEventListener('mouseup', onMouseup);

		return {
			destroy() {
				window.removeEventListener('mousemove', onMove);
				window.removeEventListener('mousemove', onMousedown);

				grabbers.forEach((grabber) => {
					element.removeChild(grabber);
				});
			}
		};
	}
</script>

<!-- shadow-[18px_0px_5px_-15px_rgba(0,0,0,0.3)] -->
<div
	bind:this={selector}
	class="absolute top-1/2 -translate-y-1/2 z-[100] bg-surface-50 border-2 border-primary-300 rounded-full shadow-around-10"
	style="width: {transform.width}%; height: {transform.height}%; right: {transform.x}px;"
	use:resize
>
	<div class="h-full grid grid-rows-4 divide-y-2 divide-primary-300">
		<div
			on:mousedown={(e) => onCreate(e, mapObjectType.Desk)}
			tabindex="0"
			role="button"
			class="rounded-t-full flex items-center justify-center"
		>
			<p class="select-none text-primary-500 font-semibold">Desk</p>
		</div>
		<div class="grid grid-rows-2 divide-y-2 divide-primary-300">
			<div class="grid grid-cols-2 divide-x-2 divide-primary-300">
				<div
					class="flex items-center justify-center"
					on:mousedown={(e) => onCreate(e, mapObjectType.Wall)}
					tabindex="0"
					role="button"
				>
					<p class="select-none text-primary-500 font-semibold">Wall</p>
				</div>
				<div
					class="flex items-center justify-center"
					on:mousedown={(e) => onCreate(e, mapObjectType.Label)}
					tabindex="0"
					role="button"
				>
					<p class="select-none text-primary-500 font-semibold">Label</p>
				</div>
			</div>
			<div class="grid grid-cols-2 divide-x-2 divide-primary-300">
				<div class="flex items-center justify-center" />
				<div
					class=" flex items-center justify-center"
					on:mousedown={(e) => onCreate(e, mapObjectType.Door)}
					tabindex="0"
					role="button"
				>
					<p class="select-none text-primary-500 font-semibold">Door</p>
				</div>
			</div>
		</div>
		<div
			class=" flex items-center justify-center"
			on:mousedown={(e) => onCreate(e, mapObjectType.Room)}
			tabindex="0"
			role="button"
		>
			<p class="select-none text-primary-500 font-semibold">Room</p>
		</div>
		<div class=" rounded-b-full" />
	</div>
</div>
