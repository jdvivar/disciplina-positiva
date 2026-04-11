<script lang="ts">
  import { t } from '../../lib/i18n';
  import { saveExercise, getExerciseProgress } from '../../lib/progress';
  import ExerciseBadge from '../ExerciseBadge.svelte';

  interface Props {
    id: string;
    title: string;
    instructions: string;
    onSave?: () => void;
  }

  let { id, title, instructions, onSave }: Props = $props();

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

  let selfValues: number[] = $state(dimensions.map(() => 2));
  let childValues: number[] = $state(dimensions.map(() => 2));
  let notes = $state('');
  let saved = $state(false);

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
    }
    notes = (progress?.answers?.notes as string) ?? '';
  });

  function handleSave() {
    saveExercise(id, { selfValues, childValues, notes });
    saved = true;
    onSave?.();
  }
</script>

<div class="my-6 rounded-2xl bg-sage-50 p-6 border-3 border-sage-600">
  <div class="mb-3 flex items-center gap-2">
    <ExerciseBadge completed={saved} />
  </div>

  <h3 class="mb-2 font-heading text-lg font-semibold text-sage-700">{title}</h3>
  <p class="mb-4 font-body text-sm leading-relaxed text-sage-500">{instructions}</p>

  <div class="space-y-4">
    {#each dimensions as dimension, index (dimension)}
      <div class="rounded-lg bg-white p-4">
        <h4 class="mb-3 font-body text-sm font-medium text-sage-700">{dimension}</h4>

        <div class="space-y-3">
          <!-- Self slider -->
          <label class="block">
            <span class="mb-1 block font-body text-xs font-medium text-sage-600">
              Usted
            </span>
            <span class="flex items-center gap-3">
              <span class="w-10 text-right font-body text-xs text-sage-500">
                {t('exercise.scale.low')}
              </span>
              <input
                type="range"
                min="1"
                max="4"
                bind:value={selfValues[index]}
                class="flex-1 accent-sage-600"
              />
              <span class="w-10 font-body text-xs text-sage-500">
                {t('exercise.scale.high')}
              </span>
              <span class="w-6 text-center font-body text-sm font-semibold text-sage-700">
                {selfValues[index]}
              </span>
            </span>
          </label>

          <!-- Child slider -->
          <label class="block">
            <span class="mb-1 block font-body text-xs font-medium text-sage-600">
              Su hijo(a)
            </span>
            <span class="flex items-center gap-3">
              <span class="w-10 text-right font-body text-xs text-sage-500">
                {t('exercise.scale.low')}
              </span>
              <input
                type="range"
                min="1"
                max="4"
                bind:value={childValues[index]}
                class="flex-1 accent-sage-600"
              />
              <span class="w-10 font-body text-xs text-sage-500">
                {t('exercise.scale.high')}
              </span>
              <span class="w-6 text-center font-body text-sm font-semibold text-sage-700">
                {childValues[index]}
              </span>
            </span>
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

  <div class="mt-4">
    <button
      onclick={handleSave}
      class="rounded-lg bg-sage-600 px-4 py-2 font-body text-sm font-medium text-white hover:bg-sage-700"
    >
      {saved ? t('exercise.saved') : t('exercise.save')}
    </button>
  </div>
</div>
