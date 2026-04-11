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

  $effect(() => {
    const progress = getExerciseProgress(id);
    if (progress?.answers?.values) {
      values = [...(progress.answers.values as number[])];
      saved = progress.completed;
    }
    notes = (progress?.answers?.notes as string) ?? '';
  });

  function handleSave() {
    saveExercise(id, { values, notes });
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
      <div class="rounded-lg bg-white p-5">
        <p class="mb-3 font-body text-sm font-semibold text-sage-700">
          {dimension.name}
        </p>
        <div class="flex justify-between mb-1">
          <span class="font-body text-[11px] text-sage-500 font-medium">{dimension.low}</span>
          <span class="font-body text-[11px] text-sage-500 font-medium">{dimension.high}</span>
        </div>
        <input
          type="range"
          min="0"
          max="100"
          bind:value={values[index]}
          class="w-full accent-sage-600"
        />
        <div class="flex justify-between mt-2">
          <span class="w-1/3 font-body text-[11px] text-sage-400 leading-snug">{dimension.lowDesc}</span>
          <span class="w-1/3 font-body text-[11px] text-sage-400 leading-snug text-right">{dimension.highDesc}</span>
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
