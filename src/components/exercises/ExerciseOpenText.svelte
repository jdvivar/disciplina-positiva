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

  let text = $state('');
  let notes = $state('');
  let saved = $state(false);

  $effect(() => {
    const progress = getExerciseProgress(id);
    if (progress?.answers?.text) {
      text = progress.answers.text as string;
      saved = progress.completed;
    }
    notes = (progress?.answers?.notes as string) ?? '';
  });

  let validationMessage = $state('');

  function handleSave() {
    if (!text.trim()) {
      validationMessage = 'Escribe algo antes de guardar';
      return;
    }
    validationMessage = '';
    saveExercise(id, { text, notes });
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

  <textarea
    bind:value={text}
    placeholder={t('exercise.placeholder.text')}
    rows="5"
    oninput={() => validationMessage = ''}
    class="w-full resize-y rounded-lg border border-sage-200 bg-white p-3 font-body text-sm text-text
      placeholder:text-muted focus:border-sage-600 focus:ring-1 focus:ring-sage-600 focus:outline-none"
  ></textarea>

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

  <div class="mt-4 flex items-center gap-3">
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
