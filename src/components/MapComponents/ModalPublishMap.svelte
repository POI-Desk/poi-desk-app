<script lang="ts">
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Label } from '$lib/components/ui/label';
	import { toast } from 'svelte-sonner';

	export let keep: boolean = false;
	export let bookings: boolean = true;

	let warningSeen: boolean = false;


	const bookingsChanged = () => {
		if (bookings) {
			return;
		}
		if (!warningSeen) {
			toast.warning('All bookings on the map will be deleted. Are you sure?', {
				position: 'bottom-center'
			});
			warningSeen = !warningSeen;
		}
	};
</script>

<div class="rounded-xl shadow-3xl flex flex-col items-center">
	<h1 class="text-2xl font-semibold">Publish Settings</h1>
	<div class="flex flex-col w-full space-y-4 my-5">
		<div class="flex flex-row space-x-2">
			<Checkbox id="terms-keep" bind:checked={keep} aria-labelledby="terms-label-keep" />
			<Label
				id="terms-label-keep"
				for="terms-keep"
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				{keep ? 'keep' : "don't keep"} map
			</Label>
		</div>
		<div class="flex flex-row space-x-2">
			<Checkbox
				id="terms-bookings"
				on:click={bookingsChanged}
				bind:checked={bookings}
				aria-labelledby="terms-label-bookings"
			/>
			<Label
				id="terms-label-bookings"
				for="terms-bookings"
				class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>
				remove {bookings ? ' necessary ' : ' all '} bookings
			</Label>
		</div>
	</div>
	<slot/> 
</div>
