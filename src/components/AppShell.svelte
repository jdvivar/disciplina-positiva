<script lang="ts">
  import type { Snippet } from 'svelte';
  import type { ChapterMeta } from '../lib/types';
  import { t, getLocale } from '../lib/i18n';
  import { countCompleted } from '../lib/progress';
  import Sidebar from './Sidebar.svelte';
  import ProgressBar from './ProgressBar.svelte';

  interface Props {
    chapters: ChapterMeta[];
    currentSlug: string;
    children: Snippet;
  }

  let { chapters, currentSlug, children }: Props = $props();

  let drawerOpen = $state(false);
  let sidebarRef: { refreshProgress: () => void } | undefined = $state(undefined);
  let mobileSidebarRef: { refreshProgress: () => void } | undefined = $state(undefined);

  let locale = $derived(getLocale());

  // Overall progress for mobile top bar
  let totalExercises = $derived(
    chapters.reduce((sum, ch) => sum + ch.exercises.length, 0)
  );
  let totalCompleted = $derived.by(() => {
    const allIds = chapters.flatMap((ch) => ch.exercises.map((e) => e.id));
    return countCompleted(allIds);
  });

  function handleNavigate(slug: string) {
    const lang = getLocale();
    window.location.href = `/${lang}/${slug}`;
  }

  function handleJournal() {
    const lang = getLocale();
    window.location.href = `/${lang}/diario`;
  }

  function handleAbout() {
    const lang = getLocale();
    window.location.href = `/${lang}/about`;
  }

  // Called by exercises after saving — refreshes sidebar progress
  export function onSave() {
    sidebarRef?.refreshProgress();
    mobileSidebarRef?.refreshProgress();
  }
</script>

<!-- Desktop sidebar (lg+) -->
<div class="hidden lg:block fixed inset-y-0 left-0 w-[220px] z-30">
  <Sidebar
    {chapters}
    {currentSlug}
    onNavigate={handleNavigate}
    onJournal={handleJournal}
    onAbout={handleAbout}
    bind:this={sidebarRef}
  />
</div>

<!-- Mobile top bar -->
<div class="lg:hidden fixed top-0 left-0 right-0 z-30 bg-sage-50 border-b border-sage-100">
  <div class="flex items-center gap-3 px-4 h-12">
    <!-- Hamburger button -->
    <button
      onclick={() => (drawerOpen = true)}
      class="p-1 -ml-1 text-sage-700"
      aria-label="Open menu"
    >
      <svg class="w-5 h-4" viewBox="0 0 20 14" fill="none">
        <path d="M0 1h20M0 7h20M0 13h20" stroke="currentColor" stroke-width="2" />
      </svg>
    </button>

    <!-- Title -->
    <span class="font-heading text-sm font-semibold text-sage-700 flex-1 truncate">
      {t('site.title', locale)}
    </span>

    <!-- Compact progress -->
    <div class="w-16">
      <ProgressBar completed={totalCompleted} total={totalExercises} />
    </div>
  </div>
</div>

<!-- Mobile drawer overlay -->
{#if drawerOpen}
  <!-- Backdrop -->
  <button
    class="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm transition-opacity"
    onclick={() => (drawerOpen = false)}
    aria-label="Close menu"
    tabindex="-1"
  ></button>

  <!-- Drawer panel -->
  <div class="lg:hidden fixed inset-y-0 left-0 z-50 w-[280px] shadow-lg transition-transform">
    <Sidebar
      {chapters}
      {currentSlug}
      onNavigate={handleNavigate}
      onJournal={handleJournal}
      onAbout={handleAbout}
      bind:this={mobileSidebarRef}
    />
  </div>
{/if}

<!-- Main content -->
<main class="lg:ml-[220px] min-h-screen">
  <!-- Spacer for mobile top bar -->
  <div class="lg:hidden h-12"></div>

  <div class="max-w-3xl mx-auto px-6 py-10">
    {@render children()}
  </div>
</main>
