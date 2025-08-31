<script lang="ts">
  let n = $state(2n);
  const squared = () => {
    n = n ** 2n;
  };
  const reset = () => {
    n = 2n;
  };
</script>

<p>Hello, svelte!</p>
<p>{n}</p>
<button type="button" onclick={squared}>click</button>
<button type="button" onclick={reset}>reset</button>
