<script lang="ts">
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { interval, addOutlook, selectedDesk } from '$lib/bookingStore';
	import { dateValue } from '$lib/dateStore';
	import { bookDesk } from '$lib/mutations/booking';
	import { user } from '$lib/userStore';

	export let parent: any;

	let desk: any = $selectedDesk;
	let date: Date = new Date($dateValue);
	const modalStore = getModalStore();

	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
  console.log("modalStore", modalStore);
  
</script>

{#if $modalStore[0]}
	<div class={cBase}>
    HELLO TEST TEST TEST
		<Stepper>
			<Step>
				<svelte:fragment slot="header">
					<h1 class="text-2xl">Register Workspace</h1>
				</svelte:fragment>
				<p class="py-4">Desk: {desk.desknum}</p>
				<p class="py-3">Date: {date.toLocaleDateString()}</p>
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text">7:00 - 13:00</span>
						<hr class="w-1/4 border-gray-500" />
						<input
							value="morning"
							type="checkbox"
							class="checkbox"
							bind:checked={$interval.morning}
						/>
					</label>
					<label class="label cursor-pointer">
						<span class="label-text">13:00 - 20:00</span>
						<hr class="w-1/4 border-gray-500" />
						<input
							value="afternoon"
							type="checkbox"
							class="checkbox"
							bind:checked={$interval.afternoon}
						/>
					</label>
				</div>
				<div class="form-control">
					<label class="label cursor-pointer">
						<span class="label-text">Add to Outlook</span>
						<hr class="w-1/4 border-gray-500" />
						<input type="checkbox" class="checkbox" bind:checked={$addOutlook} />
					</label>
				</div>
				<button class="btn variant-filled-error">Cancel</button>
				<!--TODO: close MODAL-->
				<button
					class="btn variant-filled-primary modal-button"
					disabled={!$interval.afternoon && !$interval.morning}>Book</button
				>
			</Step>
			<Step>
				<svelte:fragment slot="header">Confirm Booking: {desk.seatnum}</svelte:fragment>
				<p class="py-4">Desk: {desk.desknum}</p>
				<p class="py-4">Date: {date.toLocaleDateString()}</p>
				<p class="py-4">Time: {JSON.stringify($interval)}</p>
				<div>
					<button class="btn variant-filled-error">Back</button>
					<!--TODO: CLOSE MODAL-->
					<button
						class="btn variant-filled-primary modal-button"
						on:click={async () => {
							await bookDesk.mutate({
								booking: {
									date: date.toISOString().split('T')[0],
									ismorning: $interval.morning,
									isafternoon: $interval.afternoon,
									userid: $user.pk_userid,
									deskid: desk.pk_deskid
								}
							});
						}}>Confirm</button
					>
				</div></Step
			>
		</Stepper>
	</div>
{/if}
