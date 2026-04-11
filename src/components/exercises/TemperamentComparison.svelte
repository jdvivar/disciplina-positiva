<script lang="ts">
  import { getExerciseProgress } from '../../lib/progress';

  const dimensions = [
    { name: 'Nivel de actividad', low: 'Bajo', high: 'Alto' },
    { name: 'Regularidad', low: 'Bajo', high: 'Alto' },
    { name: 'Respuesta a nuevas situaciones', low: 'Rechazo', high: 'Aproximación' },
    { name: 'Adaptabilidad', low: 'Bajo', high: 'Alto' },
    { name: 'Distractibilidad', low: 'Bajo', high: 'Alto' },
    { name: 'Persistencia', low: 'Bajo', high: 'Alto' },
    { name: 'Intensidad', low: 'Bajo', high: 'Alto' },
  ];

  let childValues = $state<number[] | null>(null);
  let selfValues = $state<number[] | null>(null);

  function loadValues() {
    const childProgress = getExerciseProgress('temperament-child');
    const selfProgress = getExerciseProgress('temperament-self');
    childValues = childProgress?.answers?.values as number[] ?? null;
    selfValues = selfProgress?.answers?.values as number[] ?? null;
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
</script>

<div class="exercise-card my-6 rounded-2xl bg-sage-50 p-6 border-3 border-sage-600">
  <h3 class="mb-2 font-heading text-lg font-semibold text-sage-700">La combinación de temperamentos</h3>
  <p class="mb-4 font-body text-sm leading-relaxed text-sage-500">
    Comparación entre las puntuaciones de temperamento de su hijo(a) y las suyas.
  </p>

  {#if ready}
    <div class="mb-4 flex gap-6 font-body text-xs font-medium">
      <span class="flex items-center gap-2">
        <span class="inline-block h-3 w-3 rounded-full bg-sage-600"></span> Usted
      </span>
      <span class="flex items-center gap-2">
        <span class="inline-block h-3 w-3 rounded-full" style="background: #c17856;"></span> Su hijo(a)
      </span>
    </div>

    <div class="space-y-4">
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
              title="Su hijo(a): {childValues![i]}"
            ></div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div class="rounded-lg bg-white p-6 text-center">
      <p class="font-body text-sm text-sage-500">
        Completa los ejercicios de temperamento anteriores para ver la comparación.
      </p>
    </div>
  {/if}
</div>
