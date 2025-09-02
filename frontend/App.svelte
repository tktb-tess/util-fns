<script lang="ts">
  import { onMount } from 'svelte';
  import { modPow, initWasm } from '../dist/bundle';
  let wasmIsAvailable = $state(false);

  onMount(async () => {
    await initWasm().then(() => {
      wasmIsAvailable = true;
    })
  });
</script>

<p>Hello, svelte!</p>
<p>{wasmIsAvailable ? modPow(7n, 30n, 31n) : null}</p>
