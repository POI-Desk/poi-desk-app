<script>
	import { goto } from '$app/navigation';

	import BookingsOfSearchedUser from '$components/BookingsOfSearchedUser.svelte';
	import BookingsOfUser from '$components/PersonalBookingComponents/BookingsOfUser.svelte';
	import { searchedUser } from '$lib/searchStore';
	import { X } from 'lucide-svelte';
</script>

<!-- <div class="flex flex-col items-center">
	<div class="mb-1 ml-auto">
	  <button	
		on:click={() => {
		  goto("/");
		}}
		class="text-black px-8 py-4 rounded-full"
	  >
		<X size=35/>
	  </button>
	</div>
	<h1 class="text-2xl">{$searchedUser.username}</h1>
  </div>
   -->

<div class="relative">
	<div class="fixed top-0 left-0 w-full bg-white px-2 z-10">
		<div class="grid grid-cols-1 grid-rows-2">
			<button
				on:click={() => {
					goto('/');
				}}
				class="text-black px-0 rounded-full justify-self-end"
			>
				<X size="35" />
			</button>
			<div class="flex-1 flex items-center justify-center mb-3" style="color: #1A4775;">
				<h1 class="text-2xl">{$searchedUser.username}</h1>
			</div>
		</div>
	</div>

	<div class="pt-16 mt-3">
		<BookingsOfSearchedUser />
	</div>
</div>
