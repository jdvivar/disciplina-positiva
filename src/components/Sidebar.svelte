<script lang="ts">
  import type { ChapterMeta } from '../lib/types';
  import { t } from '../lib/i18n';
  import { loadProgress, countCompleted, getExerciseProgress, isChapterRead } from '../lib/progress';
  import ProgressBar from './ProgressBar.svelte';
  import ThemeToggle from './ThemeToggle.svelte';

  interface Props {
    chapters: ChapterMeta[];
    currentSlug: string;
    lang: string;
  }

  let { chapters, currentSlug, lang }: Props = $props();

  // Filter out the about page from the chapter navigation
  let navChapters = $derived(chapters.filter((ch) => ch.slug !== 'about'));

  // Progress state — re-derived on each refreshProgress() call
  let progressVersion = $state(0);

  function refreshProgress() {
    progressVersion++;
  }

  // Export refreshProgress so parent can call it
  export { refreshProgress };

  // Listen for exercise saves to refresh progress
  $effect(() => {
    function onExerciseSaved() {
      refreshProgress();
    }
    window.addEventListener('exercise-saved', onExerciseSaved);
    return () => window.removeEventListener('exercise-saved', onExerciseSaved);
  });

  type ChapterStatus = 'done' | 'in-progress' | 'pending';

  let chapterStatuses = $derived.by(() => {
    // Access progressVersion to trigger re-computation
    void progressVersion;

    const statuses: Map<string, ChapterStatus> = new Map();
    for (const ch of navChapters) {
      if (ch.exercises.length === 0) {
        statuses.set(ch.slug, isChapterRead(ch.slug) ? 'done' : 'pending');
        continue;
      }
      const ids = ch.exercises.map((e) => e.id);
      const completed = countCompleted(ids);
      if (completed === ids.length) {
        statuses.set(ch.slug, 'done');
      } else if (completed > 0) {
        statuses.set(ch.slug, 'in-progress');
      } else {
        statuses.set(ch.slug, 'pending');
      }
    }
    return statuses;
  });

  // Per-exercise completion, reactive to progressVersion
  let exerciseStatuses = $derived.by(() => {
    void progressVersion;
    const statuses: Map<string, boolean> = new Map();
    for (const ch of navChapters) {
      for (const ex of ch.exercises) {
        statuses.set(ex.id, getExerciseProgress(ex.id)?.completed === true);
      }
    }
    return statuses;
  });

  let totalExercises = $derived(
    navChapters.reduce((sum, ch) => sum + ch.exercises.length, 0)
  );

  let totalCompleted = $derived.by(() => {
    void progressVersion;
    const allIds = navChapters.flatMap((ch) => ch.exercises.map((e) => e.id));
    return countCompleted(allIds);
  });

</script>

<nav class="flex flex-col h-full bg-sage-50 border-r border-[var(--color-border-layout)]">
  <!-- Logo / Title -->
  <div class="pl-9 pr-5 pt-6 pb-4 flex items-center gap-3">
    <a href="/" data-astro-reload class="flex items-center gap-3 font-heading text-lg font-semibold text-sage-700 leading-tight hover:text-sage-900 transition-colors flex-1">
      <svg class="w-7 h-7 flex-shrink-0" viewBox="6 10 68 60" fill="none">
        <path d="M12 56C12 56 18 46 28 42C34 40 38 39 42 39C46 39 52 40 58 44C62 47 64 52 62 56C58 62 48 64 40 64C30 64 20 62 12 56Z" fill="#52796f"/>
        <path d="M40 39V14" stroke="#40916c" stroke-width="5" stroke-linecap="round"/>
        <path d="M40 28C34 22 24 19 21 22C18 25 22 34 30 34C35 34 38 31 40 28Z" fill="#40916c"/>
        <path d="M40 20C46 14 56 11 59 14C62 17 58 26 50 26C45 26 42 23 40 20Z" fill="#b7e4c7"/>
      </svg>
      {t('site.title', lang)}
    </a>
    <ThemeToggle />
  </div>

  <!-- Chapter list -->
  <div class="flex-1 overflow-y-auto px-3">
    <ul class="space-y-1.5">
      {#each navChapters as chapter (chapter.slug)}
        {@const status = chapterStatuses.get(chapter.slug) ?? 'pending'}
        {@const isCurrent = chapter.slug === currentSlug}
        <li>
          <a
            href="/{lang}/{chapter.slug}"
            class="group flex items-start gap-2 px-6 py-5 rounded-lg transition-all no-underline
              {isCurrent
                ? 'bg-sage-100'
                : 'hover:bg-sage-100/50'}"
          >
            <span class="flex-1">
              {#if chapter.chapter}
                <span class="block font-body text-xs uppercase tracking-wider transition-colors {isCurrent ? 'text-sage-700' : 'text-sage-500 group-hover:text-sage-700'}">
                  Capítulo {chapter.chapter}
                </span>
              {/if}
              <span class="block font-heading text-sm leading-snug transition-colors {isCurrent ? 'text-sage-900' : 'text-sage-500 group-hover:text-sage-700'}">
                {chapter.title}
              </span>
            </span>
            {#if status === 'done'}
              <span class="text-sage-600 text-xs flex-shrink-0 mt-0.5">&#10003;</span>
            {/if}
          </a>
          {#if isCurrent && chapter.exercises.length > 0}
            <ul class="pb-2">
              {#each chapter.exercises as exercise}
                {@const done = exerciseStatuses.get(exercise.id) === true}
                <li>
                  <a
                    href="/{lang}/{chapter.slug}#{exercise.id}"
                    class="flex items-center gap-2.5 pl-9 pr-6 py-1.5 font-body text-xs text-sage-500 rounded-md no-underline hover:bg-sage-100/50 transition-colors"
                  >
                    {#if done}
                      <span class="h-1.5 w-1.5 rounded-full bg-sage-600 flex-shrink-0"></span>
                    {:else}
                      <span class="h-1.5 w-1.5 rounded-full border border-sage-200 flex-shrink-0"></span>
                    {/if}
                    <span class="flex-1">{exercise.title}</span>
                    {#if done}
                      <span class="text-sage-600 text-xs flex-shrink-0">&#10003;</span>
                    {/if}
                  </a>
                </li>
              {/each}
            </ul>
          {/if}
        </li>
      {/each}
    </ul>
  </div>

  <!-- Journal & About links -->
  <div class="px-3 pb-2 space-y-1.5 border-t border-[var(--color-border-layout)] pt-2">
    <a
      href="/{lang}/diario"
      class="block px-6 py-5 rounded-lg font-heading text-sm text-sage-500 hover:bg-sage-100 transition-colors no-underline"
    >
      {t('nav.journal', lang)}
    </a>
    <a
      href="/{lang}/about"
      class="block px-6 py-5 rounded-lg font-heading text-sm text-sage-500 hover:bg-sage-100 transition-colors no-underline"
    >
      {t('nav.about', lang)}
    </a>
  </div>

  <!-- Overall progress — matches sticky bottom nav height -->
  <div class="px-9 border-t border-[var(--color-border-layout)]" style="height: var(--nav-height); display: flex; align-items: center;">
    <div class="w-full">
      <ProgressBar
        completed={totalCompleted}
        total={totalExercises}
        label="{totalCompleted} {t('progress.of', lang)} {totalExercises} {t('progress.exercises', lang)}"
      />
    </div>
  </div>
</nav>
