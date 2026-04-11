import { mount } from 'svelte';
import ExerciseRenderer from '../components/ExerciseRenderer.svelte';
import type { ExerciseData } from './types';

export function hydrateExercises() {
  const chapterPage = document.querySelector('.chapter-page');
  if (!chapterPage) return;

  const chapterNumber = chapterPage.getAttribute('data-chapter-number') ?? '0';
  const exerciseDivs = chapterPage.querySelectorAll<HTMLDivElement>('[data-exercise-id]');
  let exerciseIndex = 0;

  exerciseDivs.forEach((div) => {
    exerciseIndex++;
    const id = div.getAttribute('data-exercise-id') ?? '';
    const type = (div.getAttribute('data-exercise-type') ?? 'open-text') as ExerciseData['type'];
    const title = div.getAttribute('data-exercise-title') ?? '';
    const instructions = div.textContent?.trim() ?? '';
    const listPrompt = div.getAttribute('data-exercise-list-prompt') ?? undefined;
    const listCountAttr = div.getAttribute('data-exercise-list-count');
    const listCount = listCountAttr !== null ? parseInt(listCountAttr, 10) : undefined;
    let questions: string[] | undefined;
    try {
      const q = div.getAttribute('data-exercise-questions');
      if (q) questions = JSON.parse(q);
    } catch {}
    let radioQuestions: { question: string; options: string[] }[] | undefined;
    try {
      const rq = div.getAttribute('data-exercise-radio-questions');
      if (rq) radioQuestions = JSON.parse(rq);
    } catch {}
    let scaleDescriptions: { lowDesc: string; highDesc: string }[] | undefined;
    try {
      const sd = div.getAttribute('data-exercise-scale-descriptions');
      if (sd) scaleDescriptions = JSON.parse(sd);
    } catch {}

    const number = chapterNumber !== '0' ? `${chapterNumber}-${exerciseIndex}` : undefined;
    const exercise: ExerciseData = { id, type, title, instructions, number, listPrompt, listCount, questions, radioQuestions, scaleDescriptions };

    const wrapper = document.createElement('div');
    wrapper.className = 'exercise-slot';
    wrapper.id = id;
    div.replaceWith(wrapper);

    mount(ExerciseRenderer, {
      target: wrapper,
      props: {
        exercise,
        onSave: () => {
          window.dispatchEvent(new CustomEvent('exercise-saved'));
        },
      },
    });
  });
}
