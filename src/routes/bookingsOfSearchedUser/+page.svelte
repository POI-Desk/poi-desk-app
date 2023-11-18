<script>

	import BookingsOfSearchedUser from "$components/BookingsOfSearchedUser.svelte";
import { searchedUser } from "$lib/searchStore";

</script>
<h1>{$searchedUser.username}</h1>

<BookingsOfSearchedUser></BookingsOfSearchedUser>