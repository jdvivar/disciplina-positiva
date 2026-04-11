<script lang="ts">
  import { t } from '../../lib/i18n';
  import { saveExercise, getExerciseProgress } from '../../lib/progress';
  import ExerciseBadge from '../ExerciseBadge.svelte';

  interface Props {
    id: string;
    title: string;
    instructions: string;
    number?: string;
    onSave?: () => void;
  }

  let { id, title, instructions, number, onSave }: Props = $props();

  const dimensions = [
    { name: 'Nivel de actividad', low: 'Bajo', high: 'Alto' },
    { name: 'Regularidad', low: 'Bajo', high: 'Alto' },
    { name: 'Respuesta a las nuevas situaciones', low: 'Rechazo', high: 'Aproximación' },
    { name: 'Adaptabilidad', low: 'Bajo', high: 'Alto' },
    { name: 'Distractibilidad', low: 'Bajo', high: 'Alto' },
    { name: 'Persistencia', low: 'Bajo', high: 'Alto' },
    { name: 'Intensidad', low: 'Bajo', high: 'Alto' },
  ];

  let selfValues: number[] = $state(dimensions.map(() => 50));
  let childValues: number[] = $state(dimensions.map(() => 50));
  let notes = $state('');
  let saved = $state(false);
  let savedAt = $state<string | null>(null);

  $effect(() => {
    const progress = getExerciseProgress(id);
    if (progress?.answers?.selfValues) {
      selfValues = [...(progress.answers.selfValues as number[])];
    }
    if (progress?.answers?.childValues) {
      childValues = [...(progress.answers.childValues as number[])];
    }
    if (progress?.completed) {
      saved = true;
      savedAt = progress.savedAt;
    }
    notes = (progress?.answers?.notes as string) ?? '';
  });

  function handleSave() {
    saveExercise(id, { selfValues, childValues, notes });
    saved = true;
    savedAt = new Date().toISOString();
    onSave?.();
  }
</script>

<div class="exercise-card my-6 rounded-2xl p-6 border-3 {saved ? 'bg-[var(--color-exercise-done)] border-sage-200' : 'bg-sage-50 border-sage-600'}">
  <div class="mb-3">
    <ExerciseBadge number={number} />
  </div>

  <h3 class="mb-2 font-heading text-lg font-semibold text-sage-700"><a href="#{id}">{title}</a></h3>
  <p class="mb-4 font-body text-sm leading-relaxed text-sage-500">{instructions}</p>

  <div class="space-y-4">
    {#each dimensions as dimension, index (dimension.name)}
      <div class="rounded-lg bg-white p-4">
        <h4 class="mb-3 font-body text-sm font-medium text-sage-700">{dimension.name}</h4>

        <div class="space-y-3">
          <!-- Self slider -->
          <label class="block">
            <span class="mb-1 block font-body text-xs font-medium text-sage-600">
              Usted
            </span>
            <div class="flex justify-between mb-1">
              <span class="font-body text-xs text-sage-500">{dimension.low}</span>
              <span class="font-body text-xs text-sage-500">{dimension.high}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              bind:value={selfValues[index]}
              class="w-full accent-sage-600"
            />
          </label>

          <!-- Child slider -->
          <label class="block">
            <span class="mb-1 block font-body text-xs font-medium text-sage-600">
              Su hijo(a)
            </span>
            <div class="flex justify-between mb-1">
              <span class="font-body text-xs text-sage-500">{dimension.low}</span>
              <span class="font-body text-xs text-sage-500">{dimension.high}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              bind:value={childValues[index]}
              class="w-full accent-sage-600"
            />
          </label>
        </div>
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
    {#if saved && savedAt}
      <span class="ml-auto flex items-center gap-2">
        <span class="font-body text-xs text-sage-400">{new Date(savedAt).toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
        <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-sage-600 text-white text-xs font-bold">&#10003;</span>
      </span>
    {/if}
  </div>
</div>
