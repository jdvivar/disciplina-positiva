<script lang="ts">
  import { t } from '../../lib/i18n';
  import { getExerciseProgress, saveExercise } from '../../lib/progress';

  interface Props {
    onSave?: () => void;
  }

  let { onSave }: Props = $props();

  const dimensions = [
    { name: 'Nivel de actividad', low: 'Bajo', high: 'Alto' },
    { name: 'Regularidad', low: 'Bajo', high: 'Alto' },
    { name: 'Respuesta a nuevas situaciones', low: 'Rechazo', high: 'Aproximación' },
    { name: 'Adaptabilidad', low: 'Bajo', high: 'Alto' },
    { name: 'Distractibilidad', low: 'Bajo', high: 'Alto' },
    { name: 'Persistencia', low: 'Bajo', high: 'Alto' },
    { name: 'Intensidad', low: 'Bajo', high: 'Alto' },
  ];

  const DIFF_COUNT = 5;
  const SIM_COUNT = 6;

  let childValues = $state<number[] | null>(null);
  let selfValues = $state<number[] | null>(null);

  let differences = $state<string[]>(Array(DIFF_COUNT * 2).fill(''));
  let similarities = $state<string[]>(Array(SIM_COUNT * 2).fill(''));
  let notes = $state('');
  let saved = $state(false);
  let savedAt = $state<string | null>(null);
  let validationMessage = $state('');

  function loadValues() {
    const childProgress = getExerciseProgress('temperament-child');
    const selfProgress = getExerciseProgress('temperament-self');
    childValues = childProgress?.answers?.values as number[] ?? null;
    selfValues = selfProgress?.answers?.values as number[] ?? null;

    const comboProgress = getExerciseProgress('temperament-combo');
    if (comboProgress?.answers) {
      const savedDiff = comboProgress.answers.differences as string[] ?? [];
      differences = Array(DIFF_COUNT * 2).fill('').map((_, i) => savedDiff[i] ?? '');
      const savedSim = comboProgress.answers.similarities as string[] ?? [];
      similarities = Array(SIM_COUNT * 2).fill('').map((_, i) => savedSim[i] ?? '');
      notes = (comboProgress.answers.notes as string) ?? '';
      saved = comboProgress.completed;
      savedAt = comboProgress.savedAt;
    }
  }

  $effect(() => {
    loadValues();

    function onExerciseSaved() {
      loadValues();
    }
    window.addEventListener('exercise-saved', onExerciseSaved);
    return () => window.removeEventListener('exercise-saved', onExerciseSaved);
  });

  let ready = $derived(childValues !== null && selfValues !== null);

  function handleSave() {
    const hasContent = differences.some(d => d.trim()) || similarities.some(s => s.trim());
    if (!hasContent) {
      validationMessage = 'Escribe al menos una respuesta antes de guardar';
      return;
    }
    validationMessage = '';
    saveExercise('temperament-combo', { differences, similarities, notes });
    saved = true;
    savedAt = new Date().toISOString();
    onSave?.();
  }
</script>

<div class="exercise-card my-6 rounded-2xl p-6 border-3 {saved ? 'bg-[var(--color-exercise-done)] border-sage-200' : 'bg-sage-50 border-sage-600'}">
  <h3 class="mb-2 font-heading text-lg font-semibold text-sage-700"><a href="#temperament-combo">La combinación de temperamentos</a></h3>
  <p class="mb-4 font-body text-sm leading-relaxed text-sage-500">
    Comparación entre las puntuaciones de temperamento de su hijo/a y las suyas.
  </p>

  {#if ready}
    <div class="mb-4 flex gap-6 font-body text-xs font-medium">
      <span class="flex items-center gap-2">
        <span class="inline-block h-3 w-3 rounded-full bg-sage-600"></span> Usted
      </span>
      <span class="flex items-center gap-2">
        <span class="inline-block h-3 w-3 rounded-full" style="background: #c17856;"></span> Su hijo/a
      </span>
    </div>

    <div class="space-y-4 mb-8">
      {#each dimensions as dimension, i}
        <div class="rounded-lg bg-white p-4">
          <p class="mb-2 font-body text-sm font-semibold text-sage-700">{dimension.name}</p>
          <div class="flex justify-between mb-1">
            <span class="font-body text-xs text-sage-500">{dimension.low}</span>
            <span class="font-body text-xs text-sage-500">{dimension.high}</span>
          </div>
          <div class="relative h-6">
            <div class="absolute top-1/2 left-0 right-0 h-1 -translate-y-1/2 rounded-full bg-sage-200"></div>
            <div
              class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full bg-sage-600 border-2 border-white shadow"
              style="left: {selfValues![i]}%"
              title="Usted: {selfValues![i]}"
            ></div>
            <div
              class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-4 w-4 rounded-full border-2 border-white shadow"
              style="left: {childValues![i]}%; background: #c17856;"
              title="Su hijo/a: {childValues![i]}"
            ></div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Differences -->
    <h4 class="font-heading text-base font-semibold text-sage-700 mb-4">Diferencias entre nuestros temperamentos</h4>
    <div class="space-y-4 mb-8">
      {#each Array(DIFF_COUNT) as _, i}
        <div class="space-y-2">
          <p class="font-body text-sm font-medium text-sage-700">Mi hijo/a y yo nos diferenciamos en:</p>
          <textarea
            bind:value={differences[i * 2]}
            oninput={() => validationMessage = ''}
            rows="2"
            class="w-full resize-y rounded-lg border border-sage-200 bg-white p-3 font-body text-sm text-text
              placeholder:text-muted focus:border-sage-600 focus:ring-1 focus:ring-sage-600 focus:outline-none"
          ></textarea>
          <p class="font-body text-sm font-medium text-sage-700">Esta diferencia podría producir conflictos cuando:</p>
          <textarea
            bind:value={differences[i * 2 + 1]}
            oninput={() => validationMessage = ''}
            rows="2"
            class="w-full resize-y rounded-lg border border-sage-200 bg-white p-3 font-body text-sm text-text
              placeholder:text-muted focus:border-sage-600 focus:ring-1 focus:ring-sage-600 focus:outline-none"
          ></textarea>
        </div>
      {/each}
    </div>

    <!-- Similarities -->
    <h4 class="font-heading text-base font-semibold text-sage-700 mb-4">Similitudes entre nuestros temperamentos</h4>
    <div class="space-y-4">
      {#each Array(SIM_COUNT) as _, i}
        <div class="space-y-2">
          <p class="font-body text-sm font-medium text-sage-700">Mi hijo/a y yo coincidimos en:</p>
          <textarea
            bind:value={similarities[i * 2]}
            oninput={() => validationMessage = ''}
            rows="2"
            class="w-full resize-y rounded-lg border border-sage-200 bg-white p-3 font-body text-sm text-text
              placeholder:text-muted focus:border-sage-600 focus:ring-1 focus:ring-sage-600 focus:outline-none"
          ></textarea>
          <p class="font-body text-sm font-medium text-sage-700">Esta similitud podría hacer que nos entendamos en:</p>
          <textarea
            bind:value={similarities[i * 2 + 1]}
            oninput={() => validationMessage = ''}
            rows="2"
            class="w-full resize-y rounded-lg border border-sage-200 bg-white p-3 font-body text-sm text-text
              placeholder:text-muted focus:border-sage-600 focus:ring-1 focus:ring-sage-600 focus:outline-none"
          ></textarea>
        </div>
      {/each}
    </div>

    <div class="mt-5">
      <p class="mb-2 font-body text-xs font-medium text-sage-500">Para tu diario: ¿qué aprendiste con este ejercicio?</p>
      <textarea
        bind:value={notes}
        rows="2"
        placeholder="Escribe aquí tus notas o reflexiones adicionales..."
        class="w-full resize-y rounded-lg border border-sage-200 bg-white p-3 font-body text-sm text-text
          placeholder:text-muted focus:border-sage-600 focus:ring-1 focus:ring-sage-600 focus:outline-none"
      ></textarea>
    </div>

    <div class="mt-4 flex items-center gap-3">
      <button
        onclick={handleSave}
        class="rounded-lg bg-sage-600 px-4 py-2 font-body text-sm font-medium text-white hover:bg-sage-700"
      >
        {t('exercise.save')}
      </button>
      {#if validationMessage}
        <span class="font-body text-sm text-sage-500">{validationMessage}</span>
      {/if}
      {#if saved && savedAt}
        <span class="ml-auto flex items-center gap-2">
          <span class="font-body text-xs text-sage-400">{new Date(savedAt).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
          <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-sage-600 text-white text-xs font-bold">&#10003;</span>
        </span>
      {/if}
    </div>

  {:else}
    <div class="rounded-lg bg-white p-6 text-center">
      <p class="font-body text-sm text-sage-500">
        Completa los ejercicios de temperamento anteriores para ver la comparación.
      </p>
    </div>
  {/if}
</div>
