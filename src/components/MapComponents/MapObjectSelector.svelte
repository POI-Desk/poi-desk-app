<script lang="ts">
	import { mapObjectType } from "$lib/map/props";
  import type { TransformType } from "$lib/types/transformType";
	import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();

  //TODO: use type script
  function onCreate(e: MouseEvent, type: string) {
    dispatch("create", {e, type});
  }

  let selector: HTMLDivElement | null = null;
  let transform: TransformType = {
    x: 40,
    y: 0,
    width: 10,
    height: 50,
    rotation: 0,
  };

	let left: HTMLDivElement | null = null;
	let grabbers: HTMLDivElement[] = [];

function resize(element: HTMLElement) {
		let active: HTMLElement | null = null;

		left = document.createElement('div');
		left.title = 'west';
		left.classList.add('handle', 'handle-west');

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
			initialPos = { x: event.pageX / innerWidth * 100, y: event.pageY / innerWidth * 100 };
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
				delta = initialPos!.x - event.pageX / innerWidth * 100;
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

<div bind:this={selector} 
  class="absolute top-1/2 -translate-y-1/2 bg-[#D9D9D9] z-[100] rounded-full shadow-[18px_0px_5px_-15px_rgba(0,0,0,0.3)] grid grid-rows-4"
  style="width: {transform.width}%; height: {transform.height}%; right: {transform.x}px;"
  draggable="false"
  use:resize
  >
  <div on:mousedown={(e) => onCreate(e, mapObjectType.Desk)} tabindex="0" role="button" class="bg-red-600 rounded-t-full flex items-center justify-center">
    <p>Desk</p>
  </div>
  <div class=" grid grid-cols-2 grid-rows-2">
    <div class="bg-blue-600 flex items-center justify-center" on:mousedown={(e) => onCreate(e, mapObjectType.Wall)} tabindex="0" role="button">
      <p>Wall</p>
    </div>
    <div class="bg-yellow-600">

    </div>	
    <div class="bg-purple-600">

    </div>
    <div class="bg-green-600  flex items-center justify-center" on:mousedown={(e) => onCreate(e, mapObjectType.Door)} tabindex="0" role="button">
      <p>Door</p>
    </div>	
  </div>
  <div class="bg-slate-800 flex items-center justify-center" on:mousedown={(e) => onCreate(e, mapObjectType.Room)} tabindex="0" role="button">
    <p class="bg-white" >Room</p>
  </div>
  <div class="bg-sky-700 rounded-b-full">

  </div>
</div>