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
  }

  let { chapters, currentSlug, onNavigate, onJournal }: Props = $props();

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
    for (const ch of chapters) {
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
    chapters.reduce((sum, ch) => sum + ch.exercises.length, 0)
  );

  let totalCompleted = $derived.by(() => {
    void progressVersion;
    const allIds = chapters.flatMap((ch) => ch.exercises.map((e) => e.id));
    return countCompleted(allIds);
  });

  let locale = $derived(getLocale());
</script>

<nav class="flex flex-col h-full bg-sage-50 border-r border-sage-100">
  <!-- Logo / Title -->
  <div class="px-5 pt-6 pb-4">
    <h1 class="font-heading text-base font-semibold text-sage-700 leading-tight">
      {t('site.title', locale)}
    </h1>
  </div>

  <!-- Chapter list -->
  <div class="flex-1 overflow-y-auto px-3">
    <div class="text-[9px] font-semibold uppercase tracking-wider text-sage-500 px-2 mb-2">
      {t('nav.chapters', locale)}
    </div>
    <ul class="space-y-0.5">
      {#each chapters as chapter (chapter.slug)}
        {@const status = chapterStatuses.get(chapter.slug) ?? 'pending'}
        {@const isCurrent = chapter.slug === currentSlug}
        <li>
          <button
            onclick={() => onNavigate(chapter.slug)}
            class="w-full text-left px-2 py-1.5 rounded-md text-[11px] leading-snug transition-colors
              {isCurrent
                ? 'bg-sage-100 text-sage-900 font-medium'
                : status === 'done'
                  ? 'text-sage-600 hover:bg-sage-100'
                  : 'text-sage-500 hover:bg-sage-100'}"
          >
            <span class="flex items-center gap-1.5">
              {#if status === 'done'}
                <span class="text-sage-600 text-[10px] flex-shrink-0">&#10003;</span>
              {:else if status === 'in-progress'}
                <span class="w-1.5 h-1.5 rounded-full bg-sage-600 flex-shrink-0"></span>
              {:else}
                <span class="w-1.5 h-1.5 rounded-full bg-sage-200 flex-shrink-0"></span>
              {/if}
              <span class="truncate">
                {#if chapter.chapter}
                  {chapter.chapter}.
                {/if}
                {chapter.title}
              </span>
            </span>
          </button>
        </li>
      {/each}
    </ul>
  </div>

  <!-- Journal link -->
  <div class="px-3 pb-2">
    <button
      onclick={() => onJournal()}
      class="w-full text-left px-2 py-1.5 rounded-md text-[11px] text-sage-600 hover:bg-sage-100 transition-colors"
    >
      {t('nav.journal', locale)}
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
