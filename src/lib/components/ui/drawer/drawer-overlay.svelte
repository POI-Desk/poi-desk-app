<script lang="ts">
	import { Drawer as DrawerPrimitive } from "vaul-svelte";
	import { cn } from "$lib/utils.js.js";

	type $$Props = DrawerPrimitive.OverlayProps;

	export let el: $$Props["el"] = undefined;
	let className: $$Props["class"] = undefined;
	export { className as class };
</script>

<DrawerPrimitive.Overlay
	bind:el
	class={cn("", className)}
	{...$$restProps}
>
	<slot />
</DrawerPrimitive.Overlay>
