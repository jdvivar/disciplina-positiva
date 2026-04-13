<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { PageMeta } from '../lib/types';
  import { t, getLocale } from '../lib/i18n';
  import { countCompleted } from '../lib/progress';
  import Sidebar from './Sidebar.svelte';
  import ProgressBar from './ProgressBar.svelte';
  import ThemeToggle from './ThemeToggle.svelte';

  interface Props {
    pages: PageMeta[];
    currentSlug: string;
    children: Snippet;
  }

  let { pages, currentSlug, children }: Props = $props();

  let drawerOpen = $state(false);
  let sidebarRef: { refreshProgress: () => void } | undefined = $state(undefined);
  let mobileSidebarRef: { refreshProgress: () => void } | undefined = $state(undefined);

  let locale = $derived(getLocale());

  let totalExercises = $derived(
    pages.reduce((sum, p) => sum + p.exercises.length, 0)
  );
  let totalCompleted = $derived.by(() => {
    const allIds = pages.flatMap((p) => p.exercises.map((e) => e.id));
    return countCompleted(allIds);
  });

  export function onSave() {
    sidebarRef?.refreshProgress();
    mobileSidebarRef?.refreshProgress();
  }
</script>

<!-- Desktop sidebar (lg+) -->
<div class="hidden lg:block fixed inset-y-0 left-0 w-[320px] z-30" data-testid="sidebar">
  <Sidebar
    {pages}
    {currentSlug}
    lang={locale}
    bind:this={sidebarRef}
  />
</div>

<!-- Mobile top bar -->
<div class="lg:hidden fixed top-0 left-0 right-0 z-30 bg-sage-50 border-b border-[var(--color-border-layout)]">
  <div class="flex items-center gap-3 px-4 h-12">
    <button
      onclick={() => (drawerOpen = true)}
      class="p-1 -ml-1 text-sage-700"
      aria-label="Open menu"
    >
      <svg class="w-5 h-4" viewBox="0 0 20 14" fill="none">
        <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" stroke-width="2" />
      </svg>
    </button>
    <span class="font-heading text-sm font-semibold text-sage-700 flex-1 truncate">
      {t('site.title', locale)}
    </span>
    <ThemeToggle />
    <div class="w-16">
      <ProgressBar completed={totalCompleted} total={totalExercises} />
    </div>
  </div>
</div>

<!-- Mobile drawer overlay -->
{#if drawerOpen}
  <button
    class="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
    onclick={() => (drawerOpen = false)}
    aria-label="Close menu"
    tabindex="-1"
  ></button>
  <div class="lg:hidden fixed inset-y-0 left-0 z-50 w-[320px] shadow-lg transition-transform">
    <Sidebar
      {pages}
      {currentSlug}
      lang={locale}
      bind:this={mobileSidebarRef}
    />
  </div>
{/if}

<!-- Main content -->
<main class="lg:ml-[320px] min-h-screen bg-surface-light">
  <div class="lg:hidden h-12"></div>
  <div class="max-w-[65ch] mx-auto px-6 pt-48 pb-40">
    {@render children()}
  </div>
</main>
