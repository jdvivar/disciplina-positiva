<script lang="ts">
  import type { PageMeta } from '../lib/types';
  import { loadProgress } from '../lib/progress';
  import { t } from '../lib/i18n';

  interface Props {
    chapters: PageMeta[];
  }

  let { chapters }: Props = $props();

  const dimensions = [
    { name: 'Nivel de actividad', low: 'Bajo', high: 'Alto' },
    { name: 'Regularidad', low: 'Bajo', high: 'Alto' },
    { name: 'Respuesta a nuevas situaciones', low: 'Rechazo', high: 'Aproximación' },
    { name: 'Adaptabilidad', low: 'Bajo', high: 'Alto' },
    { name: 'Distractibilidad', low: 'Bajo', high: 'Alto' },
    { name: 'Persistencia', low: 'Bajo', high: 'Alto' },
    { name: 'Intensidad', low: 'Bajo', high: 'Alto' },
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
  <div class="callout" data-callout>
    <p style="font-family: 'Fraunces', serif; font-size: 16px; color: #1b4332; line-height: 1.6;">
      Has completado la guía. No olvides guardar tu diario de crianza — puedes imprimirlo o volver a él cuando quieras.
    </p>
  </div>
</div>

<div class="print-journal max-w-[620px] mx-auto rounded-xl shadow-sm px-16 py-14" data-testid="journal" style="line-height: 1.8; background-color: #fefcf8;">
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
    <div class="print-chapter {chapterIdx > 0 ? 'mt-8' : ''}" data-testid="journal-chapter">
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
            <a href="/es/{chapter.slug}#{exercise.id}" class="print-hidden">{exercise.title}</a>
            <span class="hidden print:inline">{exercise.title}</span>
          </h3>
          <p class="font-body text-sm text-sage-500 mb-2">
            {exercise.instructions}
          </p>

          {#if exercise.type === 'temperament-comparison'}
            {@const childProgress2 = progress['temperament-child'] ?? null}
            {@const selfProgress2 = progress['temperament-self'] ?? null}
            {@const childVals2 = (childProgress2?.answers?.values ?? []) as number[]}
            {@const selfVals2 = (selfProgress2?.answers?.values ?? []) as number[]}
            {#if childVals2.length > 0 && selfVals2.length > 0}
              <div class="mb-2 flex gap-4 font-body text-xs">
                <span class="flex items-center gap-1"><svg class="w-3 h-4" viewBox="0 0 12 16"><path d="M5 2 Q7 4, 6 8 Q5 12, 7 14" stroke="#2d6a4f" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg> Usted</span>
                <span class="flex items-center gap-1"><svg class="w-3 h-4" viewBox="0 0 12 16"><path d="M7 2 Q5 5, 6 8 Q7 11, 5 14" stroke="#c17856" stroke-width="2.5" stroke-linecap="round" fill="none"/></svg> Su hijo/a</span>
              </div>
              <div class="space-y-3 mb-4">
                {#each dimensions as dim, i}
                  {#if selfVals2[i] !== undefined && childVals2[i] !== undefined}
                    <div>
                      <p class="font-body text-xs font-medium text-sage-700 mb-1">{dim.name}</p>
                      <div class="flex items-center gap-2">
                        <span class="font-body text-xs text-sage-500 w-20 text-right flex-shrink-0">{dim.low}</span>
                        <div class="relative flex-1 h-4">
                          <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 16">
                            <path d="M4 8 Q50 7, 100 9 Q150 7, 196 8" stroke="#b7e4c7" stroke-width="1" fill="none"/>
                          </svg>
                          <svg class="absolute top-0 h-full w-3 -translate-x-1/2" style="left: {selfVals2[i]}%" viewBox="0 0 12 16">
                            <path d="M5 2 Q7 4, 6 8 Q5 12, 7 14" stroke="#2d6a4f" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                          </svg>
                          <svg class="absolute top-0 h-full w-3 -translate-x-1/2" style="left: {childVals2[i]}%" viewBox="0 0 12 16">
                            <path d="M7 2 Q5 5, 6 8 Q7 11, 5 14" stroke="#c17856" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                          </svg>
                        </div>
                        <span class="font-body text-xs text-sage-500 w-20 flex-shrink-0">{dim.high}</span>
                      </div>
                    </div>
                  {/if}
                {/each}
              </div>
            {/if}
            {#if answered}
              {@const diffs = (exerciseProgress.answers.differences ?? []) as string[]}
              {@const sims = (exerciseProgress.answers.similarities ?? []) as string[]}
              {#if diffs.some(d => d.trim())}
                <p class="font-body text-sm font-medium text-sage-700 mt-2 mb-1">Diferencias entre nuestros temperamentos</p>
                {#each Array(5) as _, i}
                  {#if diffs[i * 2]?.trim() || diffs[i * 2 + 1]?.trim()}
                    <div class="mb-2">
                      {#if diffs[i * 2]?.trim()}
                        <p class="font-body text-sm text-text"><span class="text-sage-500">Nos diferenciamos en:</span> {diffs[i * 2]}</p>
                      {/if}
                      {#if diffs[i * 2 + 1]?.trim()}
                        <p class="font-body text-sm text-text"><span class="text-sage-500">Podría producir conflictos cuando:</span> {diffs[i * 2 + 1]}</p>
                      {/if}
                    </div>
                  {/if}
                {/each}
              {/if}
              {#if sims.some(s => s.trim())}
                <p class="font-body text-sm font-medium text-sage-700 mt-3 mb-1">Similitudes entre nuestros temperamentos</p>
                {#each Array(6) as _, i}
                  {#if sims[i * 2]?.trim() || sims[i * 2 + 1]?.trim()}
                    <div class="mb-2">
                      {#if sims[i * 2]?.trim()}
                        <p class="font-body text-sm text-text"><span class="text-sage-500">Coincidimos en:</span> {sims[i * 2]}</p>
                      {/if}
                      {#if sims[i * 2 + 1]?.trim()}
                        <p class="font-body text-sm text-text"><span class="text-sage-500">Nos entendemos en:</span> {sims[i * 2 + 1]}</p>
                      {/if}
                    </div>
                  {/if}
                {/each}
              {/if}
              {#if exerciseProgress.savedAt}
                <p class="mt-1 font-body text-xs text-muted">
                  {t('journal.saved-on')} {formatSavedDate(exerciseProgress.savedAt)}
                </p>
              {/if}
            {/if}

          {:else if answered}
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
              <div class="space-y-3">
                {#each dimensions as dim, i}
                  {#if values[i] !== undefined}
                    <div>
                      <p class="font-body text-xs font-medium text-sage-700 mb-1">{dim.name}</p>
                      <div class="flex items-center gap-2">
                        <span class="font-body text-xs text-sage-500 w-20 text-right flex-shrink-0">{dim.low}</span>
                        <div class="relative flex-1 h-4">
                          <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 16">
                            <path d="M4 8 Q50 7, 100 9 Q150 7, 196 8" stroke="#b7e4c7" stroke-width="1" fill="none"/>
                          </svg>
                          <svg class="absolute top-0 h-full w-3 -translate-x-1/2" style="left: {values[i]}%" viewBox="0 0 12 16">
                            <path d="M5 2 Q7 4, 6 8 Q5 12, 7 14" stroke="#2d6a4f" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                          </svg>
                        </div>
                        <span class="font-body text-xs text-sage-500 w-20 flex-shrink-0">{dim.high}</span>
                      </div>
                    </div>
                  {/if}
                {/each}
              </div>

            {:else if exercise.type === 'comparison'}
              {@const selfValues = (exerciseProgress.answers.selfValues ?? []) as number[]}
              {@const childValues = (exerciseProgress.answers.childValues ?? []) as number[]}
              <div class="space-y-3">
                {#each dimensions as dim, i}
                  {#if selfValues[i] !== undefined && childValues[i] !== undefined}
                    <div>
                      <p class="font-body text-xs font-medium text-sage-700 mb-1">{dim.name}</p>
                      <div class="flex items-center gap-2">
                        <span class="font-body text-xs text-sage-500 w-20 text-right flex-shrink-0">{dim.low}</span>
                        <div class="relative flex-1 h-4">
                          <svg class="absolute inset-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 16">
                            <path d="M4 8 Q50 7, 100 9 Q150 7, 196 8" stroke="#b7e4c7" stroke-width="1" fill="none"/>
                          </svg>
                          <svg class="absolute top-0 h-full w-3 -translate-x-1/2" style="left: {selfValues[i]}%" viewBox="0 0 12 16">
                            <path d="M5 2 Q7 4, 6 8 Q5 12, 7 14" stroke="#2d6a4f" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                          </svg>
                          <svg class="absolute top-0 h-full w-3 -translate-x-1/2" style="left: {childValues[i]}%" viewBox="0 0 12 16">
                            <path d="M7 2 Q5 5, 6 8 Q7 11, 5 14" stroke="#c17856" stroke-width="2.5" stroke-linecap="round" fill="none"/>
                          </svg>
                        </div>
                        <span class="font-body text-xs text-sage-500 w-20 flex-shrink-0">{dim.high}</span>
                      </div>
                    </div>
                  {/if}
                {/each}
              </div>

            {:else if exercise.type === 'numbered-list'}
              {@const items = (exerciseProgress.answers.items ?? []) as string[]}
              {#if items.some(item => item.trim())}
                <ol class="list-decimal pl-5 space-y-0.5">
                  {#each items as item, i}
                    {#if item.trim()}
                      <li class="font-body text-sm text-text">{item}</li>
                    {/if}
                  {/each}
                </ol>
              {/if}

            {:else if exercise.type === 'multi-section'}
              {@const items = (exerciseProgress.answers.items ?? []) as string[]}
              {@const answers = (exerciseProgress.answers.answers ?? []) as string[]}
              {#if items.some(item => item.trim())}
                <ol class="list-decimal pl-5 space-y-0.5 mb-2">
                  {#each items as item}
                    {#if item.trim()}
                      <li class="font-body text-sm text-text">{item}</li>
                    {/if}
                  {/each}
                </ol>
              {/if}
              {#each answers as answer, i}
                {#if answer.trim()}
                  <p class="font-body text-sm text-text whitespace-pre-wrap">{answer}</p>
                {/if}
              {/each}

            {:else if exercise.type === 'radio'}
              {@const selections = (exerciseProgress.answers.selections ?? []) as number[]}
              {@const rqs = exercise.radioQuestions ?? []}
              {#each rqs as rq, qi}
                {#if selections[qi] !== undefined && selections[qi] >= 0}
                  <p class="font-body text-sm text-text">
                    <span class="text-sage-500">{rq.question}</span> {rq.options[selections[qi]]}
                  </p>
                {/if}
              {/each}
            {/if}

            {#if exerciseProgress.answers.notes && (exerciseProgress.answers.notes as string).trim()}
              <div class="mt-2 pl-3 border-l-2 border-sage-200">
                <p class="font-body text-xs text-sage-500 italic">{exerciseProgress.answers.notes}</p>
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
                <a href="/es/{chapter.slug}#{exercise.id}" class="print-hidden text-sage-500 underline hover:text-sage-700">Ir al ejercicio →</a>
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
