<script>
    import { saveChangesClickable, saveChangesClicked } from "$lib/saveChangesStore";
  
    const handleClick = () => {
        console.log("handleClick, the value is now " + $saveChangesClicked);
        saveChangesClicked.set(true);
        saveChangesClickable.set(false);
    };
  </script>
  
  {#if $saveChangesClickable}
    <button on:click={handleClick}>Save Changes</button>
  {:else}
    <button disabled on:click={handleClick} >Save Changes disabled</button>
  {/if}
