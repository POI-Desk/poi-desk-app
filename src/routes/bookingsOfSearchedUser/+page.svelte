<script>
	import { goto } from "$app/navigation";


	import BookingsOfSearchedUser from "$components/BookingsOfSearchedUser.svelte";
	import { searchedUser } from "$lib/searchStore";
	import { X } from 'lucide-svelte';

</script>

  <div class="flex flex-col items-center">
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
  


<BookingsOfSearchedUser></BookingsOfSearchedUser>