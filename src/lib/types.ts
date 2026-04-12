export interface ExerciseData {
  id: string;
  title: string;
  type: 'open-text' | 'guided-list' | 'self-assessment' | 'comparison' | 'numbered-list' | 'multi-section' | 'radio' | 'temperament-comparison';
  instructions: string;
  number?: string;
  listPrompt?: string;
  listCount?: number;
  questions?: string[];
  radioQuestions?: { question: string; options: string[] }[];
  scaleDescriptions?: { lowDesc: string; highDesc: string }[];
}

export interface ExerciseProgress {
  completed: boolean;
  answers: Record<string, string | string[] | number[]>;
  savedAt: string | null;
}

export type ProgressStore = Record<string, ExerciseProgress>;

export interface ChapterMeta {
  title: string;
  chapter?: number;
  order: number;
  slug: string;
  exercises: ExerciseData[];
}

export interface PageMeta {
  title: string;
  chapter?: number;
  order: number;
  slug: string;
  exercises: ExerciseData[];
  parentSlug?: string;
  isIndex: boolean;
}
