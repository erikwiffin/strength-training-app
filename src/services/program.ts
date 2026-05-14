import type {
  ExerciseConfig,
  ExerciseId,
  ExerciseLog,
  PlannedExercise,
  PlannedWorkout,
  SetLog,
  UserSettings,
  WeightUnit,
  WorkoutLog,
  WorkoutType,
} from '../types';

export function getNextWorkoutType(logs: WorkoutLog[]): WorkoutType {
  const completed = logs.filter(l => l.completedAt !== null);
  if (completed.length === 0) return 'A';
  const sorted = [...completed].sort(
    (a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime(),
  );
  return sorted[0].type === 'A' ? 'B' : 'A';
}

export function getWorkoutExercises(type: WorkoutType): ExerciseId[] {
  if (type === 'A') return ['squat', 'bench', 'row'];
  return ['squat', 'ohp', 'deadlift'];
}

function wasExerciseSuccessful(exerciseLog: ExerciseLog): boolean {
  return exerciseLog.sets.every(s => s.completed && s.reps >= 5);
}

function getDeadliftIncrement(currentWeight: number, unit: WeightUnit, baseIncrement: number): number {
  const threshold = unit === 'lb' ? 220 : 100;
  const smallIncrement = unit === 'lb' ? 5 : 2.5;
  return currentWeight >= threshold ? smallIncrement : baseIncrement;
}

export function calculateNextWeight(
  exerciseId: ExerciseId,
  config: ExerciseConfig,
  logs: WorkoutLog[],
  weightUnit: WeightUnit,
): number {
  const completedLogs = logs
    .filter(l => l.completedAt !== null)
    .sort((a, b) => new Date(b.completedAt!).getTime() - new Date(a.completedAt!).getTime());

  for (const log of completedLogs) {
    const exerciseLog = log.exercises.find(e => e.exerciseId === exerciseId);
    if (!exerciseLog) continue;

    const weight = exerciseLog.actualWeight;
    if (wasExerciseSuccessful(exerciseLog)) {
      const increment =
        exerciseId === 'deadlift'
          ? getDeadliftIncrement(weight, weightUnit, config.increment)
          : config.increment;
      return weight + increment;
    }
    return weight;
  }

  return config.startWeight;
}

export function planWorkout(settings: UserSettings, logs: WorkoutLog[]): PlannedWorkout {
  const type = getNextWorkoutType(logs);
  const exerciseIds = getWorkoutExercises(type);

  const exercises: PlannedExercise[] = exerciseIds.map(id => {
    const config = settings.exercises[id];
    return {
      exerciseId: id,
      label: config.label,
      sets: config.sets,
      reps: config.reps,
      weight: calculateNextWeight(id, config, logs, settings.weightUnit),
    };
  });

  return {
    type,
    date: new Date().toISOString().slice(0, 10),
    exercises,
  };
}

export function createWorkoutLog(plan: PlannedWorkout, weightUnit: WeightUnit): WorkoutLog {
  return {
    id: crypto.randomUUID(),
    date: plan.date,
    type: plan.type,
    weightUnit,
    startedAt: new Date().toISOString(),
    completedAt: null,
    exercises: plan.exercises.map(pe => ({
      exerciseId: pe.exerciseId,
      label: pe.label,
      targetWeight: pe.weight,
      actualWeight: pe.weight,
      sets: Array.from({ length: pe.sets }, (): SetLog => ({
        reps: 0,
        completed: false,
      })),
    })),
  };
}
