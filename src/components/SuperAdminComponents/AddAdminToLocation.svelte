<script lang="ts">
	import { admin, admins, newAdmins } from "$lib/superAdminStore";

	function handleSelect() {
    if (!$newAdmins.includes($admin)) {
      $newAdmins.push($admin);
      $newAdmins = $newAdmins;
    }
  }
</script>

<select class="select rounded-full"
        bind:value={$admin}
        on:change={() => handleSelect()}
>
  <option value="" disabled selected>Select your option</option>
  {#each $admins as admin}
    <option value={admin}>
      {admin.username}
    </option>
  {/each}
</select>