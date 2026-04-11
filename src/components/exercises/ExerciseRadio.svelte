<script lang="ts">
  import { t } from '../../lib/i18n';
  import { saveExercise, getExerciseProgress } from '../../lib/progress';
  import ExerciseBadge from '../ExerciseBadge.svelte';

  interface RadioQuestion {
    question: string;
    options: string[];
  }

  interface Props {
    id: string;
    title: string;
    instructions: string;
    radioQuestions?: RadioQuestion[];
    onSave?: () => void;
  }

  let { id, title, instructions, radioQuestions = [], onSave }: Props = $props();

  let selections = $state<(number | null)[]>(radioQuestions.map(() => null));
  let notes = $state('');
  let saved = $state(false);
  let validationMessage = $state('');

  $effect(() => {
    const progress = getExerciseProgress(id);
    if (progress?.answers?.selections) {
      selections = (progress.answers.selections as number[]).map(v => v ?? null);
      saved = progress.completed;
    }
    notes = (progress?.answers?.notes as string) ?? '';
  });

  function handleSave() {
    if (selections.every(s => s === null)) {
      validationMessage = 'Selecciona al menos una respuesta antes de guardar';
      return;
    }
    validationMessage = '';
    saveExercise(id, { selections, notes });
    saved = true;
    onSave?.();
  }
</script>

<div class="my-6 rounded-2xl bg-sage-50 p-6 border-3 border-sage-600">
  <div class="mb-3 flex items-center gap-2">
    <ExerciseBadge completed={saved} />
  </div>

  <h3 class="mb-2 font-heading text-lg font-semibold text-sage-700">{title}</h3>
  <p class="mb-6 font-body text-sm leading-relaxed text-sage-500">{instructions}</p>

  <div class="space-y-6">
    {#each radioQuestions as rq, qi}
      <div>
        <p class="mb-3 font-body text-sm font-medium text-sage-700">{qi + 1}. {rq.question}</p>
        <div class="space-y-2 pl-4">
          {#each rq.options as option, oi}
            <label class="flex items-start gap-3 cursor-pointer group">
              <input
                type="radio"
                name="{id}-q{qi}"
                checked={selections[qi] === oi}
                onchange={() => { selections[qi] = oi; validationMessage = ''; }}
                class="mt-0.5 accent-sage-600"
              />
              <span class="font-body text-sm text-text group-hover:text-sage-700 transition-colors">{option}</span>
            </label>
          {/each}
        </div>
      </div>
    {/each}
  </div>

  <div class="mt-5">
    <p class="mb-2 font-body text-xs font-medium text-sage-500">Notas personales</p>
    <textarea
      bind:value={notes}
      rows="2"
      placeholder="Escribe aquí tus notas o reflexiones adicionales..."
      class="w-full resize-y rounded-lg border border-sage-200 bg-white p-3 font-body text-sm text-text
        placeholder:text-muted focus:border-sage-600 focus:ring-1 focus:ring-sage-600 focus:outline-none"
    ></textarea>
  </div>

  <div class="mt-6 flex items-center gap-3">
    <button
      onclick={handleSave}
      class="rounded-lg bg-sage-600 px-4 py-2 font-body text-sm font-medium text-white hover:bg-sage-700"
    >
      {saved ? t('exercise.saved') : t('exercise.save')}
    </button>
    {#if validationMessage}
      <span class="font-body text-sm text-sage-500">{validationMessage}</span>
    {/if}
  </div>
</div>
