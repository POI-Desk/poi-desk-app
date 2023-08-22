<script>
	let locations = ['Wien', 'Salzburg', 'Hagenberg'];
	//api call to server
	let chosenLocation;
</script>

<div class="grid place-items-center place-content-center space-y-6 h-screen">
	<h1 class="text-2xl">Choose Your Location:</h1>
	{#each locations as location}
		<button
			class="btn btn-block btn-primary px-14"
			on:click={() => {
				chosenLocation = location;
			}}
		>
			<a href="/location/defaultLocation">
				{location}
			</a>
		</button>
	{/each}
</div>
