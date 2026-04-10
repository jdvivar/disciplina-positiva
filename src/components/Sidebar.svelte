<script lang="ts">
  import type { ChapterMeta } from '../lib/types';
  import { t, getLocale } from '../lib/i18n';
  import { loadProgress, countCompleted } from '../lib/progress';
  import ProgressBar from './ProgressBar.svelte';

  interface Props {
    chapters: ChapterMeta[];
    currentSlug: string;
    onNavigate: (slug: string) => void;
    onJournal: () => void;
    onAbout: () => void;
  }

  let { chapters, currentSlug, onNavigate, onJournal, onAbout }: Props = $props();

  // Filter out the about page from the chapter navigation
  let navChapters = $derived(chapters.filter((ch) => ch.slug !== 'about'));

  // Progress state — re-derived on each refreshProgress() call
  let progressVersion = $state(0);

  function refreshProgress() {
    progressVersion++;
  }

  // Export refreshProgress so parent can call it
  export { refreshProgress };

  type ChapterStatus = 'done' | 'in-progress' | 'pending';

  let chapterStatuses = $derived.by(() => {
    // Access progressVersion to trigger re-computation
    void progressVersion;

    const statuses: Map<string, ChapterStatus> = new Map();
    for (const ch of navChapters) {
      if (ch.exercises.length === 0) {
        statuses.set(ch.slug, 'pending');
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

  let totalExercises = $derived(
    navChapters.reduce((sum, ch) => sum + ch.exercises.length, 0)
  );

  let totalCompleted = $derived.by(() => {
    void progressVersion;
    const allIds = navChapters.flatMap((ch) => ch.exercises.map((e) => e.id));
    return countCompleted(allIds);
  });

  let locale = $derived(getLocale());
</script>

<nav class="flex flex-col h-full bg-sage-50 border-r border-sage-100">
  <!-- Logo / Title -->
  <div class="px-5 pt-6 pb-4">
    <h1 class="flex items-center gap-2 font-heading text-base font-semibold text-sage-700 leading-tight">
      <svg class="w-6 h-6 flex-shrink-0" viewBox="6 10 68 60" fill="none">
        <path d="M12 56C12 56 18 46 28 42C34 40 38 39 42 39C46 39 52 40 58 44C62 47 64 52 62 56C58 62 48 64 40 64C30 64 20 62 12 56Z" fill="#52796f"/>
        <path d="M40 39V14" stroke="#40916c" stroke-width="5" stroke-linecap="round"/>
        <path d="M40 28C34 22 24 19 21 22C18 25 22 34 30 34C35 34 38 31 40 28Z" fill="#40916c"/>
        <path d="M40 20C46 14 56 11 59 14C62 17 58 26 50 26C45 26 42 23 40 20Z" fill="#b7e4c7"/>
      </svg>
      {t('site.title', locale)}
    </h1>
  </div>

  <!-- Chapter list -->
  <div class="flex-1 overflow-y-auto px-3">
    <ul class="space-y-1">
      {#each navChapters as chapter (chapter.slug)}
        {@const status = chapterStatuses.get(chapter.slug) ?? 'pending'}
        {@const isCurrent = chapter.slug === currentSlug}
        <li>
          <button
            onclick={() => onNavigate(chapter.slug)}
            class="group w-full text-left px-3 py-2 rounded-lg transition-all
              {isCurrent
                ? 'bg-sage-100'
                : 'hover:bg-sage-100/50'}"
          >
            <span>
              {#if chapter.chapter}
                <span class="block font-body text-[10px] uppercase tracking-wider transition-colors {isCurrent ? 'text-sage-700' : 'text-sage-500 group-hover:text-sage-700'}">
                  Capítulo {chapter.chapter}
                </span>
              {/if}
              <span class="block font-heading text-[12px] leading-snug transition-colors {isCurrent ? 'text-sage-900 font-semibold' : 'text-sage-500 group-hover:text-sage-700'}">
                {chapter.title}
              </span>
            </span>
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Journal & About links -->
  <div class="px-3 pb-2 space-y-0.5">
    <button
      onclick={() => onJournal()}
      class="w-full text-left px-2 py-1.5 rounded-md text-[11px] text-sage-600 hover:bg-sage-100 transition-colors"
    >
      {t('nav.journal', locale)}
    </button>
    <button
      onclick={() => onAbout()}
      class="w-full text-left px-2 py-1.5 rounded-md text-[11px] text-sage-500 hover:bg-sage-100 transition-colors"
    >
      {t('nav.about', locale)}
    </button>
  </div>

  <!-- Overall progress -->
  <div class="px-5 pb-5 pt-2 border-t border-sage-100">
    <ProgressBar
      completed={totalCompleted}
      total={totalExercises}
      label="{totalCompleted} {t('progress.of', locale)} {totalExercises} {t('progress.exercises', locale)}"
    />
  </div>
</nav>
