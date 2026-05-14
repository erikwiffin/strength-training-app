export type WeightUnit = 'lb' | 'kg';

export type ExerciseId = 'squat' | 'bench' | 'ohp' | 'deadlift' | 'row';

export interface ExerciseConfig {
  id: ExerciseId;
  label: string;
  startWeight: number;
  increment: number;
  sets: number;
  reps: number;
}

export type WorkoutType = 'A' | 'B';

export interface PlannedExercise {
  exerciseId: ExerciseId;
  label: string;
  sets: number;
  reps: number;
  weight: number;
}

export interface PlannedWorkout {
  type: WorkoutType;
  date: string;
  exercises: PlannedExercise[];
}

export interface SetLog {
  reps: number;
  completed: boolean;
}

export interface ExerciseLog {
  exerciseId: ExerciseId;
  label: string;
  targetWeight: number;
  actualWeight: number;
  sets: SetLog[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  type: WorkoutType;
  startedAt: string;
  completedAt: string | null;
  exercises: ExerciseLog[];
}

export interface UserSettings {
  weightUnit: WeightUnit;
  exercises: Record<ExerciseId, ExerciseConfig>;
}

export interface AppData {
  settings: UserSettings;
  workoutLogs: WorkoutLog[];
}

export type View =
  | { name: 'today' }
  | { name: 'active-workout'; workoutLogId: string }
  | { name: 'history' }
  | { name: 'workout-detail'; workoutLogId: string }
  | { name: 'settings' };
