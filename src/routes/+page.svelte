<script lang="ts">
	import DateSelection from '$components/DateSelection.svelte';

	import BuildingSelection from '$components/BuildingSelection.svelte';
	import SeatsOnFloor from '$components/DesksOnFloor.svelte';
	import SearchBar from '$components/SearchBar.svelte';
	import {user} from '$lib/userStore';
	import {goto} from "$app/navigation";
</script>

<div class="m-3">
	<a class="btn variant-filled-primary" href="./login">Login</a>

	<a class="btn variant-filled-primary" href="./location">Location</a>

	<button class="btn variant-filled-primary" on:click={() => {goto("/extendedUser")}}>Extended User</button>

	<!--Debugging-->
	<!-- <p>{$user.pk_userid ?? 'no id'}</p> -->
	<p>You are logged in as {$user.username ?? 'no username'}</p>
	<p>Your location is {$user.location?.locationname ?? 'no location'}</p>
	<!-- <p>{$user.location?.pk_locationid ?? 'no location'}</p> -->
	<!---->
	<SearchBar/>

	<DateSelection />

	<div class="flex justify-center">
		<div class="absolute bottom-20">
			<BuildingSelection />
		</div>
	</div>

	<SeatsOnFloor />
</div>
