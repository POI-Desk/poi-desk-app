<script lang="ts"></script>


<div class="overflow-hidden h-screen flex flex-col items-center align-middle">
  <h1 class="absolute h1 text-primary-500" style="top: 20px">Access Denied</h1>
  <span class="absolute text-2xl" style="bottom: 50%">Sorry, you do not have the required rights to access this page.</span>
  <button
    on:click={() => window.location = "/"}
    class="absolute btn variant-filled-primary shadow-md"
    style="bottom: 50px">Back to POI-Desk</button>
</div>
