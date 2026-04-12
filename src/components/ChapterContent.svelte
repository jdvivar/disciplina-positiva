<script lang="ts">
  import type { PageMeta } from '../lib/types';
  import { t, getLocale } from '../lib/i18n';
  import { markPageRead } from '../lib/progress';

  interface Props {
    page: PageMeta;
    prevPage: PageMeta | null;
    nextPage: PageMeta | null;
  }

  let { page, prevPage, nextPage }: Props = $props();

  let locale = $derived(getLocale());
  let reachedBottom = $state(false);
  let visible = $state(false);
  let lastScrollY = $state(0);

  $effect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const scrolled = window.innerHeight + scrollY;
      const total = document.documentElement.scrollHeight;
      const atBottom = total - scrolled < 200;

      if (atBottom) {
        reachedBottom = true;
        visible = true;
      } else if (scrollY < lastScrollY) {
        visible = true;
      } else {
        visible = false;
      }

      lastScrollY = scrollY;
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  });

  function handleNextClick() {
    if (reachedBottom) {
      markPageRead(page.slug);
      window.dispatchEvent(new CustomEvent('exercise-saved'));
    }
  }
</script>

<nav
  class="fixed left-0 lg:left-[320px] right-0 z-20 border-t border-[var(--color-border-layout)] px-4 bg-surface-light transition-transform duration-300 ease-in-out {visible ? 'translate-y-0' : 'translate-y-full'}"
  style="bottom: 0; height: var(--nav-height); display: flex; align-items: center;"
>
  <div class="max-w-[65ch] mx-auto flex gap-3 w-full py-3">
    {#if prevPage}
      <a
        href="/{locale}/{prevPage.slug}"
        data-testid="nav-prev"
        class="flex items-center bg-sage-50 rounded-xl no-underline transition-colors hover:bg-sage-100
          {nextPage ? 'justify-center w-16 flex-shrink-0 self-stretch lg:flex-1 lg:w-auto lg:justify-start lg:gap-2.5 lg:px-4 lg:py-3' : 'flex-1 gap-2.5 px-4 py-3'}"
      >
        <svg class="w-5 h-5 text-sage-600 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
        <span class="{nextPage ? 'hidden lg:block' : ''}">
          <span class="block font-body text-xs uppercase tracking-wider text-sage-500">{t('chapter.prev', locale)}</span>
          <span class="block font-heading text-sm font-semibold text-sage-900">{prevPage.title}</span>
        </span>
      </a>
    {:else}
      <div class="w-16 flex-shrink-0 lg:flex-1 lg:w-auto"></div>
    {/if}

    {#if nextPage}
      <a
        href="/{locale}/{nextPage.slug}"
        onclick={handleNextClick}
        data-testid="nav-next"
        class="flex-1 flex items-center gap-2.5 bg-sage-600 rounded-xl px-4 py-3 no-underline text-right justify-end transition-colors hover:bg-sage-700"
      >
        <span>
          <span class="block font-body text-xs uppercase tracking-wider text-sage-200">{t('chapter.next', locale)}</span>
          <span class="block font-heading text-sm font-semibold text-white">{nextPage.title}</span>
        </span>
        <svg class="w-5 h-5 text-white flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
        </svg>
      </a>
    {:else}
      <div class="flex-1"></div>
    {/if}
  </div>
</nav>
