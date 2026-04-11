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

  let items: string[] = $state([]);
  let newItem = $state('');
  let saved = $state(false);

  $effect(() => {
    const progress = getExerciseProgress(id);
    if (progress?.answers?.items) {
      items = [...(progress.answers.items as string[])];
      saved = progress.completed;
    }
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

  function handleSave() {
    saveExercise(id, { items });
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
      disabled={!newItem.trim()}
      class="rounded-lg bg-sage-600 px-4 py-2 font-body text-sm font-medium text-white
        hover:bg-sage-700 disabled:cursor-not-allowed disabled:opacity-50"
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

  <button
    onclick={handleSave}
    disabled={items.length === 0}
    class="rounded-lg bg-sage-600 px-4 py-2 font-body text-sm font-medium text-white
      hover:bg-sage-700 disabled:cursor-not-allowed disabled:opacity-50"
  >
    {saved ? t('exercise.saved') : t('exercise.save')}
  </button>
</div>
