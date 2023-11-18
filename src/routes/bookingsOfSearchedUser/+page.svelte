<script>
	import { goto } from "$app/navigation";


	import BookingsOfSearchedUser from "$components/BookingsOfSearchedUser.svelte";
	import { searchedUser } from "$lib/searchStore";
	import { X, Undo2 } from 'lucide-svelte';

</script>

<button	
	on:click={() => {
		goto("/");
	}}
	class="absolute right-0 text-black px-8 py-4 rounded-full">
	<X size=35/>
</button>

<h1>{$searchedUser.username}</h1>

<BookingsOfSearchedUser></BookingsOfSearchedUser>