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
<!-- shadow-[18px_0px_5px_-15px_rgba(0,0,0,0.3)] -->
<div bind:this={selector} 
  class="absolute top-1/2 -translate-y-1/2 bg-[#D9D9D9] z-[100] rounded-full shadow-[0px_0px_75px_1px_rgba(0,0,0,0.1)] grid grid-rows-4"
  style="width: {transform.width}%; height: {transform.height}%; right: {transform.x}px;"
  use:resize
  >
  <div on:mousedown={(e) => onCreate(e, mapObjectType.Desk)} tabindex="0" role="button" class="border-b-2 border-b-[#CCC5B9] rounded-t-full flex items-center justify-center">
    <p class="select-none">Desk</p>
  </div>
  <div class=" grid grid-cols-2 grid-rows-2">
    <div class="border-r-2 border-r-[#CCC5B9] border-b-2 border-b-[#CCC5B9] border-t-2 border-t-[#CCC5B9] flex items-center justify-center" on:mousedown={(e) => onCreate(e, mapObjectType.Wall)} tabindex="0" role="button">
      <p class="select-none">Wall</p>
    </div>
    <div class="border-l-2 border-l-[#CCC5B9] border-b-2 border-b-[#CCC5B9] border-t-2 border-t-[#CCC5B9]">

    </div>	
    <div class="border-r-2 border-r-[#CCC5B9] border-t-2 border-t-[#CCC5B9] border-b-2 border-b-[#CCC5B9]">

    </div>
    <div class="border-l-2 border-l-[#CCC5B9] border-t-2 border-t-[#CCC5B9] border-b-2 border-b-[#CCC5B9] flex items-center justify-center" on:mousedown={(e) => onCreate(e, mapObjectType.Door)} tabindex="0" role="button">
      <p class="select-none">Door</p>
    </div>	
  </div>
  <div class="border-t-2 border-t-[#CCC5B9] border-b-2 border-b-[#CCC5B9] flex items-center justify-center" on:mousedown={(e) => onCreate(e, mapObjectType.Room)} tabindex="0" role="button">
    <p class="select-none">Room</p>
  </div>
  <div class="border-t-2 border-t-[#CCC5B9] rounded-b-full">
    
  </div>
</div>