<script lang="ts">
	import { user } from '$lib/userStore';
	import { SlideToggle, type ModalSettings, getModalStore } from '@skeletonlabs/skeleton';
	import { Pen } from 'lucide-svelte';
	import type { PageData } from './$types';

	export let data: PageData;

	let lightModeTrue = true;
	let addToOutlookTrue = false;

	const modal: ModalSettings = {
		type: 'component',
		component: 'modalChangeDefaultLocation'
	};

	//decode jwt
	const jwtData = data.sessionToken?.split('.')[1];
	const decodedJwt = JSON.parse(atob(jwtData ?? ''));

	const modalStore = getModalStore();
</script>

<a class="btn variant-filled-primary" href="./">Go the fuck back</a>

<div class="rounded-3xl bg-red-500 h-1/2 mt-5 p-2 m-2 flex flex-col gap-2">
	<div class="rounded-3xl flex flex-row bg-green-500 h-1/2 p-2">
		<div class="w-1/2 flex justify-center items-center">
			<img
				class="rounded-full h-full"
				src={decodedJwt.picture}
				alt="profile picture"
			/>
		</div>
		<div class="flex flex-col w-1/2">
			<h1>{decodedJwt.name}</h1>
			<hr />
			<h1>POI/AT</h1>
			<h1>{$user.location?.locationname}</h1>
		</div>
	</div>
	<button
		on:click={() => {
			modalStore.trigger(modal);
		}}
		class="rounded-3xl bg-green-500 h-1/6 flex flex-row justify-center items-center gap-5"
	>
		<div>
			{$user.location?.locationname}
		</div>
		<Pen /></button
	>
	<div class="rounded-3xl bg-green-500 h-1/6 flex flex-row justify-around items-center">
		<div>Light Mode</div>
		<div class="flex items-center">
			<SlideToggle name="themeChanger" bind:checked={lightModeTrue} />
		</div>
	</div>
	Statistics:
	<div class="rounded-3xl bg-green-500 h-1/6 flex flex-row gap-2">
		<div class="w-1/2 flex justify-center items-center bg-yellow-500 rounded-3xl">August</div>
		<div class="w-1/2 flex justify-center items-center bg-yellow-500 rounded-3xl">12</div>
	</div>
</div>

<style>
	hr {
		border: 1px solid black;
	}
</style>
