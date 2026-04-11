import type { ExerciseData } from './types';

export function extractExercisesFromRaw(rawBody: string): ExerciseData[] {
  const exercises: ExerciseData[] = [];
  const pattern =
    /<div\s+data-exercise-id="([^"]*?)"\s+data-exercise-type="([^"]*?)"\s+data-exercise-title="([^"]*?)"([^>]*)>([\s\S]*?)<\/div>/g;
  let match: RegExpExecArray | null;
  while ((match = pattern.exec(rawBody)) !== null) {
    const attrs = match[4];
    const rawInstructions = match[5];
    const instructions = rawInstructions
      .replace(/<[^>]+>/g, '\n')
      .replace(/\n{2,}/g, '\n')
      .trim();
    const exercise: ExerciseData = {
      id: match[1],
      type: match[2] as ExerciseData['type'],
      title: match[3],
      instructions,
    };
    const rqMatch = attrs.match(/data-exercise-radio-questions='([^']*)'/);
    if (rqMatch) {
      try { exercise.radioQuestions = JSON.parse(rqMatch[1]); } catch {}
    }
    exercises.push(exercise);
  }
  return exercises;
}
