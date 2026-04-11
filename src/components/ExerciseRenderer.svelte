<script lang="ts">
  import type { ExerciseData } from '../lib/types';
  import ExerciseOpenText from './exercises/ExerciseOpenText.svelte';
  import ExerciseList from './exercises/ExerciseList.svelte';
  import ExerciseScale from './exercises/ExerciseScale.svelte';
  import ExerciseComparison from './exercises/ExerciseComparison.svelte';
  import ExerciseNumberedList from './exercises/ExerciseNumberedList.svelte';
  import ExerciseMultiSection from './exercises/ExerciseMultiSection.svelte';
  import ExerciseRadio from './exercises/ExerciseRadio.svelte';
  import TemperamentComparison from './exercises/TemperamentComparison.svelte';

  interface Props {
    exercise: ExerciseData;
    onSave?: () => void;
  }

  let { exercise, onSave }: Props = $props();
</script>

{#if exercise.type === 'open-text'}
  <ExerciseOpenText id={exercise.id} title={exercise.title} instructions={exercise.instructions} number={exercise.number} {onSave} />
{:else if exercise.type === 'guided-list'}
  <ExerciseList id={exercise.id} title={exercise.title} instructions={exercise.instructions} number={exercise.number} {onSave} />
{:else if exercise.type === 'self-assessment'}
  <ExerciseScale id={exercise.id} title={exercise.title} instructions={exercise.instructions} scaleDescriptions={exercise.scaleDescriptions} number={exercise.number} {onSave} />
{:else if exercise.type === 'comparison'}
  <ExerciseComparison id={exercise.id} title={exercise.title} instructions={exercise.instructions} number={exercise.number} {onSave} />
{:else if exercise.type === 'numbered-list'}
  <ExerciseNumberedList id={exercise.id} title={exercise.title} instructions={exercise.instructions} number={exercise.number} {onSave} />
{:else if exercise.type === 'multi-section'}
  <ExerciseMultiSection id={exercise.id} title={exercise.title} instructions={exercise.instructions} listPrompt={exercise.listPrompt} listCount={exercise.listCount} questions={exercise.questions} number={exercise.number} {onSave} />
{:else if exercise.type === 'radio'}
  <ExerciseRadio id={exercise.id} title={exercise.title} instructions={exercise.instructions} radioQuestions={exercise.radioQuestions} number={exercise.number} {onSave} />
{:else if exercise.type === 'temperament-comparison'}
  <TemperamentComparison />
{/if}
