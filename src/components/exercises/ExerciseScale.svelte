<script lang="ts">
  import { t } from '../../lib/i18n';
  import { saveExercise, getExerciseProgress } from '../../lib/progress';
  import ExerciseBadge from '../ExerciseBadge.svelte';

  interface Props {
    id: string;
    title: string;
    instructions: string;
    number?: string;
    scaleDescriptions?: { lowDesc: string; highDesc: string }[];
    onSave?: () => void;
  }

  let { id, title, instructions, number, scaleDescriptions, onSave }: Props = $props();

  const dimensions = [
    { name: 'Nivel de actividad', low: 'Bajo', high: 'Alto', lowDesc: 'Prefiero actividades tranquilas', highDesc: 'Prefiero estar físicamente activo/a' },
    { name: 'Regularidad', low: 'Bajo', high: 'Alto', lowDesc: 'Me da hambre o me canso a diferentes horas', highDesc: 'Siempre tengo hambre o me canso a la misma hora' },
    { name: 'Respuesta a las nuevas situaciones', low: 'Rechazo', high: 'Aproximación', lowDesc: 'Me siento incómodo en situaciones nuevas o con gente nueva', highDesc: 'Me gusta conocer nuevos lugares y gente nueva' },
    { name: 'Adaptabilidad', low: 'Bajo', high: 'Alto', lowDesc: 'Me cuesta adaptarme a nuevas rutinas', highDesc: 'Me adapto rápido a nuevas situaciones' },
    { name: 'Distractibilidad', low: 'Bajo', high: 'Alto', lowDesc: 'Puedo concentrarme en una cosa por largo tiempo', highDesc: 'Me distraigo fácilmente' },
    { name: 'Persistencia', low: 'Bajo', high: 'Alto', lowDesc: 'Pierdo interés fácilmente y cambio a otras cosas', highDesc: 'Me concentro en algo hasta terminarlo' },
    { name: 'Intensidad', low: 'Bajo', high: 'Alto', lowDesc: 'No muestro mis emociones, otra gente no sabe lo que pienso', highDesc: 'Cuando estoy triste, enojado o feliz, los otros se dan cuenta' },
  ];

  let values: number[] = $state(dimensions.map(() => 50));
  let notes = $state('');
  let saved = $state(false);
  let savedAt = $state<string | null>(null);

  $effect(() => {
    const progress = getExerciseProgress(id);
    if (progress?.answers?.values) {
      values = [...(progress.answers.values as number[])];
      saved = progress.completed;
      savedAt = progress.savedAt;
    }
    notes = (progress?.answers?.notes as string) ?? '';
  });

  function handleSave() {
    saveExercise(id, { values, notes });
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
    {#each dimensions as dimension, index (dimension)}
      <div class="rounded-lg bg-white p-5">
        <p class="mb-3 font-body text-sm font-semibold text-sage-700">
          {dimension.name}
        </p>
        <div class="flex justify-between mb-1">
          <span class="font-body text-xs text-sage-500 font-medium">{dimension.low}</span>
          <span class="font-body text-xs text-sage-500 font-medium">{dimension.high}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          bind:value={values[index]}
          class="w-full accent-sage-600"
        />
        <div class="flex justify-between mt-2">
          <span class="w-1/3 font-body text-xs text-sage-400 leading-snug">{scaleDescriptions?.[index]?.lowDesc ?? dimension.lowDesc}</span>
          <span class="w-1/3 font-body text-xs text-sage-400 leading-snug text-right">{scaleDescriptions?.[index]?.highDesc ?? dimension.highDesc}</span>
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
