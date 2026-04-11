<script lang="ts">
  import type { ChapterMeta } from '../lib/types';
  import { t, getLocale } from '../lib/i18n';

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

  function handleNavigate(slug: string) {
    const lang = getLocale();
    window.location.href = `/${lang}/${slug}`;
  }
</script>

<!-- Prev/Next navigation — fixed bottom bar -->
<nav class="fixed bottom-0 left-0 lg:left-[320px] right-0 z-20 border-t border-sage-100 px-6" style="background-color: #f7faf8; min-height: 80px; display: flex; align-items: center;">
  <div class="max-w-[65ch] mx-auto flex items-center justify-between w-full">
    {#if prevChapter}
      <a
        href="/{locale}/{prevChapter.slug}"
        class="flex items-center gap-2 text-sm text-sage-600 hover:text-sage-800 transition-colors no-underline"
      >
        <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
            clip-rule="evenodd"
          />
        </svg>
        <span>
          <span class="block text-[10px] uppercase tracking-wider text-sage-400">{t('chapter.prev', locale)}</span>
          <span class="block font-medium">{prevChapter.title}</span>
        </span>
      </a>
    {:else}
      <div></div>
    {/if}

    {#if nextChapter}
      <a
        href="/{locale}/{nextChapter.slug}"
        class="flex items-center gap-2 text-sm text-sage-600 hover:text-sage-800 transition-colors text-right no-underline"
      >
        <span>
          <span class="block text-[10px] uppercase tracking-wider text-sage-400">{t('chapter.next', locale)}</span>
          <span class="block font-medium">{nextChapter.title}</span>
        </span>
        <svg class="w-4 h-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path
            fill-rule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clip-rule="evenodd"
          />
        </svg>
      </a>
    {:else}
      <div></div>
    {/if}
  </div>
</nav>
