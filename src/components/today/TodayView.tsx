import type { PlannedWorkout, WeightUnit, WorkoutLog } from '../../types';
import { PlannedExerciseCard } from './PlannedExerciseCard';

interface TodayViewProps {
  plan: PlannedWorkout;
  weightUnit: WeightUnit;
  activeWorkout: WorkoutLog | undefined;
  onStartWorkout: () => void;
  onResumeWorkout: (id: string) => void;
}

export function TodayView({ plan, weightUnit, activeWorkout, onStartWorkout, onResumeWorkout }: TodayViewProps) {
  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Workout {plan.type}</h2>
        <p className="text-sm opacity-70">
          {new Date(plan.date).toLocaleDateString(undefined, {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="space-y-2">
        {plan.exercises.map(exercise => (
          <PlannedExerciseCard
            key={exercise.exerciseId}
            exercise={exercise}
            weightUnit={weightUnit}
          />
        ))}
      </div>

      {activeWorkout ? (
        <button
          className="btn btn-warning btn-block btn-lg"
          onClick={() => onResumeWorkout(activeWorkout.id)}
        >
          Resume Workout
        </button>
      ) : (
        <button
          className="btn btn-primary btn-block btn-lg"
          onClick={onStartWorkout}
        >
          Start Workout
        </button>
      )}
    </div>
  );
}
