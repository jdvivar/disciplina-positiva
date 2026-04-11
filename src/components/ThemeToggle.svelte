<script lang="ts">
  let dark = $state(false);

  $effect(() => {
    dark = document.documentElement.classList.contains('dark');
  });

  function toggle() {
    dark = !dark;
    document.documentElement.classList.toggle('dark', dark);
    document.documentElement.style.backgroundColor = dark ? '#141f1a' : '#e8f0ec';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
    localStorage.setItem('theme-set-at', String(Date.now()));
  }
</script>

<button
  onclick={toggle}
  class="w-7 h-7 flex items-center justify-center rounded-lg text-sage-500 hover:bg-sage-100 transition-colors"
  aria-label={dark ? 'Modo claro' : 'Modo oscuro'}
>
  {#if dark}
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="5"/>
      <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
    </svg>
  {:else}
    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/>
    </svg>
  {/if}
</button>
