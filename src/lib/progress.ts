import type { ExerciseProgress, ProgressStore } from './types';

const STORAGE_KEY = 'dp-progress';

export function loadProgress(): ProgressStore {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveExercise(
  id: string,
  answers: ExerciseProgress['answers']
): ProgressStore {
  const store = loadProgress();
  store[id] = {
    completed: true,
    answers,
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  return store;
}

export function getExerciseProgress(id: string): ExerciseProgress | null {
  const store = loadProgress();
  return store[id] ?? null;
}

export function countCompleted(exerciseIds: string[]): number {
  const store = loadProgress();
  return exerciseIds.filter((id) => store[id]?.completed).length;
}

export function getTotalExerciseCount(): number {
  return 9;
}
