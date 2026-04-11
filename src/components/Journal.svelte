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

  let chaptersWithExercises = $derived(chapters.filter((ch) => ch.exercises.length > 0));

  let progress = $state(loadProgress());

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

<!-- Journal reminder callout — not printed -->
<div class="print-hidden max-w-[620px] mx-auto mb-6">
  <div class="callout" data-callout style="background: #e8f0ec; border-radius: 16px; padding: 28px 32px;">
    <p style="font-family: 'Fraunces', serif; font-size: 16px; color: #1b4332; line-height: 1.6;">
      Has completado la guía. No olvides guardar tu diario de crianza — puedes imprimirlo o volver a él cuando quieras.
    </p>
  </div>
</div>

<div class="print-journal max-w-[620px] mx-auto rounded-xl shadow-sm px-16 py-14" style="line-height: 1.8; background-color: #fefcf8;">
  <!-- Header -->
  <div class="print-header mb-10 pb-5 border-b border-sage-100">
    <h1 class="font-heading text-2xl font-bold text-sage-900 mb-1">
      {t('journal.title')}
    </h1>
    <p class="print-subtitle font-body text-sage-500 text-sm">
      {today}
    </p>
  </div>

  <!-- Site credit -->
  <div class="mb-10">
    <div class="bg-sage-50 rounded-lg px-5 py-4 border border-sage-100">
      <p class="font-body text-sm font-medium text-sage-700">
        Creado en
        <a href="https://disciplina-positiva.vercel.app" class="text-sage-600 underline print-hidden">https://disciplina-positiva.vercel.app</a>
        <span class="hidden print:inline">https://disciplina-positiva.vercel.app</span>
      </p>
    </div>
  </div>

  <!-- Chapters -->
  {#each chaptersWithExercises as chapter, chapterIdx (chapter.slug)}
    <div class="print-chapter {chapterIdx > 0 ? 'mt-8' : ''}">
      <div class="mb-5">
        {#if chapter.chapter}
          <p class="font-body text-xs uppercase tracking-widest text-sage-500 mb-1">Capítulo {chapter.chapter}</p>
        {/if}
        <h2 class="font-heading text-lg font-semibold text-sage-900">{chapter.title}</h2>
      </div>

      <!-- Exercises -->
      {#each chapter.exercises as exercise (exercise.id)}
        {@const exerciseProgress = progress[exercise.id] ?? null}
        {@const answered = exerciseProgress?.completed === true}

        <div class="print-exercise mb-7">
          <h3 class="font-heading text-sm font-semibold text-sage-700 mb-1">
            {exercise.title}
          </h3>
          <p class="font-body text-sm text-sage-500 mb-2">
            {exercise.instructions}
          </p>

          {#if answered}
            {#if exercise.type === 'open-text'}
              <p class="font-body text-sm text-text whitespace-pre-wrap">
                {exerciseProgress.answers.text ?? ''}
              </p>

            {:else if exercise.type === 'guided-list'}
              {@const items = (exerciseProgress.answers.items ?? []) as string[]}
              {#if items.length > 0}
                <ul class="list-disc pl-5 space-y-0.5">
                  {#each items as item (item)}
                    <li class="font-body text-sm text-text">{item}</li>
                  {/each}
                </ul>
              {/if}

            {:else if exercise.type === 'self-assessment'}
              {@const values = (exerciseProgress.answers.values ?? []) as number[]}
              <div class="grid max-w-[300px]" style="grid-template-columns: 1fr auto; gap: 1px 16px;">
                {#each dimensions as dim, i (dim)}
                  {#if values[i] !== undefined}
                    <span class="font-body text-sm text-text">{dim}</span>
                    <span class="font-body text-sm text-text">{values[i]}/5</span>
                  {/if}
                {/each}
              </div>

            {:else if exercise.type === 'comparison'}
              {@const selfValues = (exerciseProgress.answers.selfValues ?? []) as number[]}
              {@const childValues = (exerciseProgress.answers.childValues ?? []) as number[]}
              <div class="space-y-0.5">
                {#each dimensions as dim, i (dim)}
                  {#if selfValues[i] !== undefined && childValues[i] !== undefined}
                    <p class="font-body text-sm text-text">
                      {dim} — Usted {selfValues[i]}/5, Hijo(a) {childValues[i]}/5
                    </p>
                  {/if}
                {/each}
              </div>
            {/if}

            {#if exerciseProgress.savedAt}
              <p class="mt-1 font-body text-xs text-muted">
                {t('journal.saved-on')} {formatSavedDate(exerciseProgress.savedAt)}
              </p>
            {/if}

          {:else}
            <div class="border-b border-dashed border-sage-200 min-h-[60px] flex items-end pb-1">
              <p class="font-body text-xs text-sage-300">
                Este espacio se completará con tu respuesta al ejercicio.
                <a href="/es/{chapter.slug}" class="print-hidden text-sage-500 underline hover:text-sage-700">Ir al capítulo →</a>
              </p>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/each}

  <!-- Footer -->
  <!-- Print button -->
  <div class="print-hidden mt-10 flex justify-center">
    <button
      onclick={handlePrint}
      class="rounded-lg bg-sage-600 px-6 py-3 font-body text-sm font-medium text-white hover:bg-sage-700 transition-colors"
    >
      {t('journal.print')}
    </button>
  </div>
</div>
