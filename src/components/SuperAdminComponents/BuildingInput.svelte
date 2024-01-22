<!-- InputField.svelte -->
<script lang="ts">
    export let id: number;
    export let value: string;
    export let onInput: (id: number, value: string) => void;
  </script>
  
  <input bind:value={value} on:input={() => onInput(id, value)} />
  