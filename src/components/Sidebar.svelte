<script lang="ts">
  import type { PageMeta } from '../lib/types';
  import { t } from '../lib/i18n';
  import { countCompleted, getExerciseProgress, isPageRead } from '../lib/progress';
  import ProgressBar from './ProgressBar.svelte';
  import ThemeToggle from './ThemeToggle.svelte';

  interface Props {
    pages: PageMeta[];
    currentSlug: string;
    lang: string;
  }

  let { pages, currentSlug, lang }: Props = $props();

  let navPages = $derived(pages.filter((p) => p.slug !== 'about'));

  let progressVersion = $state(0);

  function refreshProgress() {
    progressVersion++;
  }

  export { refreshProgress };

  $effect(() => {
    function onExerciseSaved() {
      refreshProgress();
    }
    window.addEventListener('exercise-saved', onExerciseSaved);
    return () => window.removeEventListener('exercise-saved', onExerciseSaved);
  });

  interface ChapterGroup {
    groupSlug: string;
    indexPage: PageMeta;
    subPages: PageMeta[];
  }

  let chapterGroups = $derived.by(() => {
    const groups: ChapterGroup[] = [];
    const groupMap = new Map<string, ChapterGroup>();

    for (const page of navPages) {
      if (page.isIndex) {
        const group: ChapterGroup = {
          groupSlug: page.slug,
          indexPage: page,
          subPages: [],
        };
        groups.push(group);
        groupMap.set(page.slug, group);
      } else if (page.parentSlug) {
        const group = groupMap.get(page.parentSlug);
        if (group) {
          group.subPages.push(page);
        }
      }
    }

    return groups;
  });

  let activeGroupSlug = $derived.by(() => {
    if (currentSlug.includes('/')) return currentSlug.split('/')[0];
    return currentSlug;
  });

  type ChapterStatus = 'done' | 'in-progress' | 'pending';

  let groupStatuses = $derived.by(() => {
    void progressVersion;
    const statuses = new Map<string, ChapterStatus>();

    for (const group of chapterGroups) {
      const allPages = [group.indexPage, ...group.subPages];
      const allExerciseIds = allPages.flatMap((p) => p.exercises.map((e) => e.id));
      const allPagesRead = allPages.every((p) => isPageRead(p.slug));
      const allExercisesDone = allExerciseIds.length > 0
        ? countCompleted(allExerciseIds) === allExerciseIds.length
        : true;

      if (allPagesRead && allExercisesDone) {
        statuses.set(group.groupSlug, 'done');
      } else {
        const anyPageRead = allPages.some((p) => isPageRead(p.slug));
        const anyExerciseDone = allExerciseIds.length > 0 && countCompleted(allExerciseIds) > 0;
        if (anyPageRead || anyExerciseDone) {
          statuses.set(group.groupSlug, 'in-progress');
        } else {
          statuses.set(group.groupSlug, 'pending');
        }
      }
    }

    return statuses;
  });

  let exerciseStatuses = $derived.by(() => {
    void progressVersion;
    const statuses = new Map<string, boolean>();
    for (const page of navPages) {
      for (const ex of page.exercises) {
        statuses.set(ex.id, getExerciseProgress(ex.id)?.completed === true);
      }
    }
    return statuses;
  });

  let pageReadStatuses = $derived.by(() => {
    void progressVersion;
    const statuses = new Map<string, boolean>();
    for (const page of navPages) {
      statuses.set(page.slug, isPageRead(page.slug));
    }
    return statuses;
  });

  let totalExercises = $derived(
    navPages.reduce((sum, p) => sum + p.exercises.length, 0)
  );

  let totalCompleted = $derived.by(() => {
    void progressVersion;
    const allIds = navPages.flatMap((p) => p.exercises.map((e) => e.id));
    return countCompleted(allIds);
  });

  function isSubPageDone(page: PageMeta): boolean {
    if (page.exercises.length === 0) {
      return pageReadStatuses.get(page.slug) === true;
    }
    const ids = page.exercises.map((e) => e.id);
    return countCompleted(ids) === ids.length;
  }
</script>

<nav class="flex flex-col h-full bg-sage-50 border-r border-[var(--color-border-layout)]">
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

  <div class="flex-1 overflow-y-auto px-3">
    <ul class="space-y-1.5">
      {#each chapterGroups as group (group.groupSlug)}
        {@const status = groupStatuses.get(group.groupSlug) ?? 'pending'}
        {@const isActiveGroup = group.groupSlug === activeGroupSlug}
        {@const isCurrentPage = group.indexPage.slug === currentSlug}
        <li>
          <a
            href="/{lang}/{group.indexPage.slug}"
            class="group flex items-start gap-2 px-6 py-5 rounded-lg transition-all no-underline
              {isCurrentPage ? 'bg-sage-100' : isActiveGroup ? 'bg-sage-100/70' : 'hover:bg-sage-100/50'}"
          >
            <span class="flex-1">
              {#if group.indexPage.chapter}
                <span class="block font-body text-xs uppercase tracking-wider transition-colors {isActiveGroup ? 'text-sage-700' : 'text-sage-500 group-hover:text-sage-700'}">
                  Capitulo {group.indexPage.chapter}
                </span>
              {/if}
              <span class="block font-heading text-sm leading-snug transition-colors {isActiveGroup ? 'text-sage-900' : 'text-sage-500 group-hover:text-sage-700'}">
                {group.indexPage.title}
              </span>
            </span>
            {#if status === 'done'}
              <span class="text-sage-600 text-xs flex-shrink-0 mt-0.5">&#10003;</span>
            {/if}
          </a>
          {#if isActiveGroup && group.subPages.length > 0}
            <ul class="pb-2">
              {#each group.subPages as subPage (subPage.slug)}
                {@const isSubCurrent = subPage.slug === currentSlug}
                {@const subDone = isSubPageDone(subPage)}
                <li>
                  <a
                    href="/{lang}/{subPage.slug}"
                    class="flex items-center gap-2.5 pl-9 pr-6 py-2 font-body text-xs rounded-md no-underline transition-colors
                      {isSubCurrent ? 'bg-sage-100 text-sage-900' : 'text-sage-500 hover:bg-sage-100/50'}"
                  >
                    {#if subDone}
                      <span class="h-1.5 w-1.5 rounded-full bg-sage-600 flex-shrink-0" data-testid="subpage-done"></span>
                    {:else}
                      <span class="h-1.5 w-1.5 rounded-full border border-sage-200 flex-shrink-0" data-testid="subpage-pending"></span>
                    {/if}
                    <span class="flex-1">{subPage.title}</span>
                    {#if subDone}
                      <span class="text-sage-600 text-xs flex-shrink-0">&#10003;</span>
                    {/if}
                  </a>
                  {#if isSubCurrent && subPage.exercises.length > 0}
                    <ul class="pb-1">
                      {#each subPage.exercises as exercise}
                        {@const done = exerciseStatuses.get(exercise.id) === true}
                        <li>
                          <a
                            href="/{lang}/{subPage.slug}#{exercise.id}"
                            class="flex items-center gap-2.5 pl-14 pr-6 py-1.5 font-body text-xs text-sage-500 rounded-md no-underline hover:bg-sage-100/50 transition-colors"
                          >
                            {#if done}
                              <span class="h-1.5 w-1.5 rounded-full bg-sage-600 flex-shrink-0" data-testid="exercise-done"></span>
                            {:else}
                              <span class="h-1.5 w-1.5 rounded-full border border-sage-200 flex-shrink-0" data-testid="exercise-pending"></span>
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
          {/if}
          {#if isActiveGroup && group.subPages.length === 0 && isCurrentPage && group.indexPage.exercises.length > 0}
            <ul class="pb-2">
              {#each group.indexPage.exercises as exercise}
                {@const done = exerciseStatuses.get(exercise.id) === true}
                <li>
                  <a
                    href="/{lang}/{group.indexPage.slug}#{exercise.id}"
                    class="flex items-center gap-2.5 pl-9 pr-6 py-1.5 font-body text-xs text-sage-500 rounded-md no-underline hover:bg-sage-100/50 transition-colors"
                  >
                    {#if done}
                      <span class="h-1.5 w-1.5 rounded-full bg-sage-600 flex-shrink-0" data-testid="exercise-done"></span>
                    {:else}
                      <span class="h-1.5 w-1.5 rounded-full border border-sage-200 flex-shrink-0" data-testid="exercise-pending"></span>
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

  <div class="px-3 pb-2 space-y-1.5 border-t border-[var(--color-border-layout)] pt-2">
    <a href="/{lang}/diario" class="block px-6 py-5 rounded-lg font-heading text-sm text-sage-500 hover:bg-sage-100 transition-colors no-underline">
      {t('nav.journal', lang)}
    </a>
    <a href="/{lang}/about" class="block px-6 py-5 rounded-lg font-heading text-sm text-sage-500 hover:bg-sage-100 transition-colors no-underline">
      {t('nav.about', lang)}
    </a>
  </div>

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
