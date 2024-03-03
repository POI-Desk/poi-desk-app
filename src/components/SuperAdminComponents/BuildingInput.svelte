<!-- InputField.svelte -->
<script lang="ts">

  export let id: Number;
  export let name: string;
  export let onInput: (id: number, name: string) => void;
  export let colSpan = 2  ;
</script>

<input
  bind:value={name} on:input={() => onInput(id, name)}
  class="input bg-white col-span-{colSpan}"
  type="text"
  placeholder="Enter a name"
/>
