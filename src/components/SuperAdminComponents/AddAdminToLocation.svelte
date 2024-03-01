<script lang="ts">
	import { newAdmins, admin, admins, isSaveDisabled } from '$lib/superAdminStore';

	function handleSelect() {
		if (!$newAdmins.includes($admin)) {
			$newAdmins.push($admin);
			$newAdmins = $newAdmins;
		}
		console.log($newAdmins);
	}
</script>

<select class="select"
	bind:value={$admin.pk_userid}
	on:change={() => {

		handleSelect();
	}}
>
	<option value="" disabled selected>Select your option</option>
	{#each $admins as admin}
		<option value={admin.pk_userid}>
			{admin.username}
		</option>
	{/each}
</select>

{$admin.pk_userid}
