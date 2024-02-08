<script lang="ts">
	import LoginPage from '$components/Login.svelte';
	import { page } from '$app/stores';
</script>

<div class="flex justify-center">
	<div class="w-2/3">
		<LoginPage />
		<div>
			{#if $page.data.session}
				<span>
					<small>Signed in as</small><br />
				</span>
			{:else}
				<form method="post">
					<span>You are not signed in</span>
					<button type="submit"> Sign In with Google</button>
				</form>
			{/if}
		</div>
	</div>
</div>
