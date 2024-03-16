<script lang="ts">
	import LoginPage from '$components/Login.svelte';
	import { page } from '$app/stores';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';

</script>

<div class="flex justify-center">
	<div class="h-full overflow-hidden">
		<LoginPage />
		<div>
			<!--
			{#if $page.data.session}
				<span>
					<small>Signed in as</small><br />
				</span>
			{:else}
				<form method="post">
					<span>You are not signed in</span>
					<Button type="submit"> Sign In with Google</Button>
				</form>
			{/if}
			-->
		</div>
	</div>
</div>
