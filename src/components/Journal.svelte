<script lang="ts">
  import type { ChapterMeta } from '../lib/types';
  import { loadProgress } from '../lib/progress';
  import { t } from '../lib/i18n';

  interface Props {
    chapters: ChapterMeta[];
  }

  let { chapters }: Props = $props();

  const dimensions = [
    'Nivel de actividad',
    'Regularidad',
    'Reacción inicial',
    'Adaptabilidad',
    'Intensidad',
    'Estado de ánimo',
    'Persistencia',
    'Distracción',
    'Sensibilidad',
  ];

  // Only chapters that have at least one exercise
  let chaptersWithExercises = $derived(chapters.filter((ch) => ch.exercises.length > 0));

  let progress = $state(loadProgress());

  // Today's date in Spanish locale
  const today = new Date().toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  function formatSavedDate(iso: string | null): string {
    if (!iso) return '';
    return new Date(iso).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  }

  function handlePrint() {
    window.print();
  }
</script>

<div class="print-journal max-w-3xl mx-auto px-6 py-10">
  <!-- Header -->
  <div class="mb-10 text-center">
    <h1 class="font-heading text-3xl font-bold text-sage-700 mb-2">
      {t('journal.title')}
    </h1>
    <p class="font-body text-sage-500 text-base mb-1">
      {t('journal.subtitle')}
    </p>
    <p class="font-body text-sage-400 text-sm">{today}</p>
  </div>

  <!-- Chapters -->
  {#each chaptersWithExercises as chapter, chapterIdx (chapter.slug)}
    <div class="print-chapter {chapterIdx > 0 ? 'mt-12' : ''}">
      <!-- Chapter heading -->
      <div class="mb-6">
        <h2 class="font-heading text-xl font-semibold text-sage-700">
          {#if chapter.chapter}
            <span class="text-sage-500 font-normal">Capítulo {chapter.chapter} — </span>
          {/if}
          {chapter.title}
        </h2>
        <hr class="mt-2 border-sage-200" />
      </div>

      <!-- Exercises -->
      <div class="space-y-6">
        {#each chapter.exercises as exercise (exercise.id)}
          {@const exerciseProgress = progress[exercise.id] ?? null}
          {@const answered = exerciseProgress?.completed === true}

          <div class="print-exercise rounded-2xl bg-sage-50 p-6 border border-sage-100">
            <!-- Exercise prompt -->
            <h3 class="font-heading text-base font-semibold text-sage-700 mb-1">
              {exercise.title}
            </h3>
            <p class="font-body text-sm leading-relaxed text-sage-500 mb-4">
              {exercise.instructions}
            </p>

            <!-- Answer area -->
            {#if answered}
              <div class="mt-2">
                {#if exercise.type === 'open-text'}
                  <p class="font-body text-sm text-text leading-relaxed whitespace-pre-wrap">
                    {exerciseProgress.answers.text ?? ''}
                  </p>

                {:else if exercise.type === 'guided-list'}
                  {@const items = (exerciseProgress.answers.items ?? []) as string[]}
                  {#if items.length > 0}
                    <ul class="list-disc list-inside space-y-1">
                      {#each items as item (item)}
                        <li class="font-body text-sm text-text">{item}</li>
                      {/each}
                    </ul>
                  {/if}

                {:else if exercise.type === 'self-assessment'}
                  {@const values = (exerciseProgress.answers.values ?? []) as number[]}
                  <div class="space-y-1">
                    {#each dimensions as dim, i (dim)}
                      {#if values[i] !== undefined}
                        <p class="font-body text-sm text-text">
                          <span class="font-medium">{dim}:</span>
                          {values[i]}/5
                        </p>
                      {/if}
                    {/each}
                  </div>

                {:else if exercise.type === 'comparison'}
                  {@const selfValues = (exerciseProgress.answers.selfValues ?? []) as number[]}
                  {@const childValues = (exerciseProgress.answers.childValues ?? []) as number[]}
                  <div class="space-y-1">
                    {#each dimensions as dim, i (dim)}
                      {#if selfValues[i] !== undefined && childValues[i] !== undefined}
                        <p class="font-body text-sm text-text">
                          <span class="font-medium">{dim}:</span>
                          Usted {selfValues[i]}/5 — Hijo(a) {childValues[i]}/5
                        </p>
                      {/if}
                    {/each}
                  </div>
                {/if}

                <!-- Saved date -->
                {#if exerciseProgress.savedAt}
                  <p class="mt-3 font-body text-xs text-sage-400 italic">
                    {t('journal.saved-on')} {formatSavedDate(exerciseProgress.savedAt)}
                  </p>
                {/if}
              </div>

            {:else}
              <!-- Unanswered placeholder -->
              <div
                class="border border-dashed border-sage-300 rounded-lg flex items-center justify-center"
                style="min-height: 80px;"
              >
                <p class="font-body text-sm text-sage-400 italic text-center px-4">
                  {t('journal.not-answered')}
                </p>
              </div>
            {/if}
          </div>
        {/each}
      </div>
    </div>
  {/each}

  <!-- Print button -->
  <div class="print-hidden mt-12 flex justify-center">
    <button
      onclick={handlePrint}
      class="rounded-lg bg-sage-600 px-6 py-3 font-body text-sm font-medium text-white hover:bg-sage-700 transition-colors"
    >
      {t('journal.print')}
    </button>
  </div>
</div>
