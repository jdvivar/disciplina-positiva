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

  let items: string[] = $state([]);
  let newItem = $state('');
  let notes = $state('');
  let saved = $state(false);
  let savedAt = $state<string | null>(null);

  $effect(() => {
    const progress = getExerciseProgress(id);
    if (progress?.answers?.items) {
      items = [...(progress.answers.items as string[])];
      saved = progress.completed;
      savedAt = progress.savedAt;
    }
    notes = (progress?.answers?.notes as string) ?? '';
  });

  function addItem() {
    const trimmed = newItem.trim();
    if (trimmed) {
      items.push(trimmed);
      newItem = '';
    }
  }

  function removeItem(index: number) {
    items.splice(index, 1);
  }

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      event.preventDefault();
      addItem();
    }
  }

  let validationMessage = $state('');

  function handleSave() {
    if (items.length === 0) {
      validationMessage = 'Agrega al menos un elemento antes de guardar';
      return;
    }
    validationMessage = '';
    saveExercise(id, { items, notes });
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

  <div class="mb-4 flex gap-2">
    <input
      type="text"
      bind:value={newItem}
      onkeydown={handleKeydown}
      placeholder={t('exercise.placeholder.list')}
      class="flex-1 rounded-lg border border-sage-200 bg-white px-3 py-2 font-body text-sm text-text
        placeholder:text-muted focus:border-sage-600 focus:ring-1 focus:ring-sage-600 focus:outline-none"
    />
    <button
      onclick={addItem}
      class="rounded-lg bg-sage-600 px-4 py-2 font-body text-sm font-medium text-white hover:bg-sage-700"
    >
      {t('exercise.list.add')}
    </button>
  </div>

  {#if items.length > 0}
    <ul class="mb-4 space-y-2">
      {#each items as item, index (index)}
        <li class="flex items-center justify-between rounded-lg border border-sage-200 bg-white px-4 py-2">
          <span class="font-body text-sm text-text">{item}</span>
          <button
            onclick={() => removeItem(index)}
            class="font-body text-xs text-sage-500 hover:text-sage-700"
          >
            {t('exercise.list.remove')}
          </button>
        </li>
      {/each}
    </ul>
  {/if}

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

  <div class="flex items-center gap-3">
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
</div>
