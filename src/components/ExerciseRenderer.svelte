<script lang="ts">
  import type { ExerciseData } from '../lib/types';
  import ExerciseOpenText from './exercises/ExerciseOpenText.svelte';
  import ExerciseList from './exercises/ExerciseList.svelte';
  import ExerciseScale from './exercises/ExerciseScale.svelte';
  import ExerciseComparison from './exercises/ExerciseComparison.svelte';

  interface Props {
    exercise: ExerciseData;
    onSave?: () => void;
  }

  let { exercise, onSave }: Props = $props();
</script>

{#if exercise.type === 'open-text'}
  <ExerciseOpenText id={exercise.id} title={exercise.title} instructions={exercise.instructions} {onSave} />
{:else if exercise.type === 'guided-list'}
  <ExerciseList id={exercise.id} title={exercise.title} instructions={exercise.instructions} {onSave} />
{:else if exercise.type === 'self-assessment'}
  <ExerciseScale id={exercise.id} title={exercise.title} instructions={exercise.instructions} {onSave} />
{:else if exercise.type === 'comparison'}
  <ExerciseComparison id={exercise.id} title={exercise.title} instructions={exercise.instructions} {onSave} />
{/if}
