<script lang="ts">
  import { getModalStore } from "@skeletonlabs/skeleton";
  import { goto } from "$app/navigation";
  import { isExtended } from "$lib/stores/extendedUserStore";
  import { curPage } from "$lib/stores/pageStore";
  import type { Role } from "$lib/types/roleTypes";
  import { user } from "$lib/stores/userStore";

  const modalStore = getModalStore();

  function notHasRole(role: string) {
    return !$user.roles?.map((r: Role) => r.rolename).includes(role);
  }
</script>

{#if $modalStore[0]}
  <div class="card p-4 w-modal shadow-xl">
    <div class="grid grid-cols-1 gap-5 text-center text-2xl">
      <div class="mb-5">Change role</div>
      <button
        class="btn variant-filled-primary"
        on:click={() => {
          $isExtended = false;
          $curPage = '/';
          goto('/');
          modalStore.close();
        }}>Default User
      </button>

      <button
        class="btn variant-filled-primary"
        disabled="{notHasRole('Extended')}"
        on:click={() => {
          $curPage = '/extendedUser';
          goto('/extendedUser');
          modalStore.close();
  			}}
      >Extended User
      </button>

      <button
        class="btn variant-filled-primary"
        disabled="{notHasRole('Admin')}"
        on:click={() => {
          goto('/admin')
          modalStore.close();
        }}
      >Admin
      </button>

      <button
        class="btn variant-filled-primary"
        disabled="{notHasRole('Super Admin')}"
        on:click={() => {
          goto('/superadmin')
          modalStore.close();
        }}
      >Super Admin
      </button>
    </div>
  </div>
{/if}

<style>
</style>
