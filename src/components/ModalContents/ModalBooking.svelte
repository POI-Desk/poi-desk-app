<script lang="ts">
	import { Stepper, Step } from '@skeletonlabs/skeleton';
	import { getModalStore } from '@skeletonlabs/skeleton';
	import { interval, selectedDesk } from '$lib/bookingStore';
	import { dateValue } from '$lib/dateStore';
	import { bookDesk } from '$lib/mutations/booking';
	import { user } from '$lib/userStore';

	export let parent: any;

	$interval.morning = false;
	$interval.afternoon = false;

	async function onCompleteHandler() {
		await bookDesk.mutate({
			booking: {
				date: date.toISOString().split('T')[0],
				ismorning: $interval.morning,
				isafternoon: $interval.afternoon,
				userid: $user.pk_userid,
				deskid: $selectedDesk.pk_deskid
			}
		});
		modalStore.close();
	}
	let date: Date = new Date($dateValue); //sieht schöner aus
	
	let stepperLock: boolean = true; 
	$: stepperLock = $interval.morning === false && $interval.afternoon === false;
	
	const modalStore = getModalStore(); 
</script>

{#if $modalStore[0]}
	<div class='card p-4 w-modal shadow-xl space-y-4'>
		<Stepper on:complete={onCompleteHandler}>
			<Step locked={stepperLock}>
				<svelte:fragment slot="header">
					<h1 class="text-2xl">Register Workspace</h1>
				</svelte:fragment>
				<p class="py-4">Desk: {$selectedDesk.desknum}</p>
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
			</Step>
			<Step>
				<svelte:fragment slot="header">Confirm Booking: {$selectedDesk.seatnum}</svelte:fragment>
				<p class="py-4">Desk: {$selectedDesk.desknum}</p>
				<p class="py-4">Date: {date.toLocaleDateString()}</p>
				<p class="py-4">Time: {JSON.stringify($interval)}</p>
			</Step>
		</Stepper>
	</div>
{/if}
