<script lang="ts">
  import type { ChapterMeta } from '../lib/types';
  import { t, getLocale } from '../lib/i18n';
  import { markChapterRead } from '../lib/progress';

  interface Props {
    chapter: ChapterMeta;
    prevChapter: ChapterMeta | null;
    nextChapter: ChapterMeta | null;
  }

  let {
    chapter,
    prevChapter,
    nextChapter,
  }: Props = $props();

  let locale = $derived(getLocale());
  let reachedBottom = $state(false);

  $effect(() => {
    function onScroll() {
      const scrolled = window.innerHeight + window.scrollY;
      const total = document.documentElement.scrollHeight;
      if (total - scrolled < 200) {
        reachedBottom = true;
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  function handleNextClick() {
    if (reachedBottom && chapter.exercises.length === 0) {
      markChapterRead(chapter.slug);
      window.dispatchEvent(new CustomEvent('exercise-saved'));
    }
  }
</script>

<!-- Prev/Next navigation — fixed bottom bar -->
<nav class="fixed bottom-0 left-0 lg:left-[320px] right-0 z-20 border-t border-[var(--color-border-layout)] px-4 bg-surface-light" style="height: var(--nav-height); display: flex; align-items: center;">
  <div class="max-w-[65ch] mx-auto flex gap-3 w-full py-3">
    {#if prevChapter}
      <a
        href="/{locale}/{prevChapter.slug}"
        class="flex items-center bg-sage-50 rounded-xl no-underline transition-colors hover:bg-sage-100
          {nextChapter ? 'justify-center w-16 flex-shrink-0 self-stretch lg:flex-1 lg:w-auto lg:justify-start lg:gap-2.5 lg:px-4 lg:py-3' : 'flex-1 gap-2.5 px-4 py-3'}"
      >
        <svg class="w-5 h-5 text-sage-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span class="{nextChapter ? 'hidden lg:block' : ''}">
          <span class="block font-body text-xs uppercase tracking-wider text-sage-500">{t('chapter.prev', locale)}</span>
          <span class="block font-heading text-sm font-semibold text-sage-900">{prevChapter.title}</span>
        </span>
      </a>
    {:else}
      <div class="w-16 flex-shrink-0 lg:flex-1 lg:w-auto"></div>
    {/if}

    {#if nextChapter}
      <a
        href="/{locale}/{nextChapter.slug}"
        onclick={handleNextClick}
        class="flex-1 flex items-center gap-2.5 bg-sage-600 rounded-xl px-4 py-3 no-underline text-right justify-end transition-colors hover:bg-sage-700"
      >
        <span>
          <span class="block font-body text-xs uppercase tracking-wider text-sage-200">{t('chapter.next', locale)}</span>
          <span class="block font-heading text-sm font-semibold text-white">{nextChapter.title}</span>
        </span>
        <svg class="w-5 h-5 text-white flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    {:else}
      <div class="flex-1"></div>
    {/if}
  </div>
</nav>
