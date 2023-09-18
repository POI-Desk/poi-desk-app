<script lang="ts">
	import { CachePolicy, graphql } from '$houdini';
	import Booking from '$components/Booking.svelte';
	import CrazyAnimation from '$components/CrazyAnimation.svelte';
	import Check from '$components/Check.svelte';

	let floorid = '5c36ec41-e3b0-40dc-b755-e2251b08010e';
	export let dateValue: string;
	let curdeskId: string;
	let curDayTime: string;
	let showModal: boolean = false;
	let selectedDesk: any;
	let visible: boolean = false;

	export const _getDesksOnFloorVariables = () => {
		return { floorid };
	};

	export const _isBookedAtVariables = () => {
		return { curdeskId, dateValue, curDayTime };
	};

	const getFloors = graphql(`
		query getAllFloors @load {
			getAllFloors {
				pk_floorid
				floorname
			}
		}
	`);

	const getdesks = graphql(`
		query getDesksOnFloor($floorid: ID!) @load {
			getDesksOnFloor(floorid: $floorid) {
				pk_deskid
				desknum
				x
				y
				bookings {
					user {
						pk_userid
					}
					date
				}
			}
		}
	`);

	$: desks = $getdesks.data?.getDesksOnFloor;
	$: floors = $getFloors.data?.getAllFloors;

	function onFloorClicked(newFloorId: string) {
		floorid = newFloorId;
		getdesks.fetch({ variables: { floorid } });
	}

	function toggleModal(desk: any) {
		showModal = !showModal;
		selectedDesk = desk;
	}

	function spinnnnn() {
		visible = true;
		setTimeout(() => {
			visible = false;
		}, 5000);
	}
</script>

<div class="btn-group btn-group-vertical">
	{#if $getFloors.fetching}
		<p>loading desks...</p>
	{:else if floors}
		{#each floors as floor}
			<button class="btn btn-primary" on:click={() => onFloorClicked(floor?.pk_floorid ?? '')}
				>{floor?.floorname}</button
			>
		{/each}
	{/if}
</div>

{#if $getdesks.fetching}
	<p>loading desks...</p>
{:else if desks}
	{#each desks as desk}
		<button
			on:click={() => toggleModal(desk)}
			class="btn btn-accent"
			class:btn-error={desk?.bookings?.find((b) => b?.date === dateValue)}>{desk?.desknum}</button
		>
	{/each}
{:else}
	<p>can't find desks</p>
{/if}

{#if showModal}
	<Booking
		date={new Date(dateValue)}
		desk={selectedDesk}
		on:close={() => {
			toggleModal(null);
			getdesks.fetch({ policy: CachePolicy.NetworkOnly });
		}}
		on:play={spinnnnn}
	/>
{/if}

{#if visible}
	<CrazyAnimation>
		<Check />
	</CrazyAnimation>
{/if}
