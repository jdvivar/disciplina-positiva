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

const PAGES_READ_KEY = 'dp-pages-read';
const OLD_CHAPTERS_READ_KEY = 'dp-chapters-read';

export function migrateChapterProgress(): void {
  if (typeof window === 'undefined') return;
  try {
    const old = localStorage.getItem(OLD_CHAPTERS_READ_KEY);
    if (!old) return;
    const oldSlugs: string[] = JSON.parse(old);
    const raw = localStorage.getItem(PAGES_READ_KEY);
    const current: string[] = raw ? JSON.parse(raw) : [];
    const merged = [...new Set([...current, ...oldSlugs])];
    localStorage.setItem(PAGES_READ_KEY, JSON.stringify(merged));
    localStorage.removeItem(OLD_CHAPTERS_READ_KEY);
  } catch {}
}

export function markPageRead(slug: string): void {
  if (typeof window === 'undefined') return;
  try {
    const raw = localStorage.getItem(PAGES_READ_KEY);
    const set: string[] = raw ? JSON.parse(raw) : [];
    if (!set.includes(slug)) {
      set.push(slug);
      localStorage.setItem(PAGES_READ_KEY, JSON.stringify(set));
    }
  } catch {}
}

export function isPageRead(slug: string): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const raw = localStorage.getItem(PAGES_READ_KEY);
    const set: string[] = raw ? JSON.parse(raw) : [];
    return set.includes(slug);
  } catch {
    return false;
  }
}
