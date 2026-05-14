import type { PlannedExercise, WeightUnit } from '../../types';

interface PlannedExerciseCardProps {
  exercise: PlannedExercise;
  weightUnit: WeightUnit;
}

export function PlannedExerciseCard({ exercise, weightUnit }: PlannedExerciseCardProps) {
  return (
    <div className="card bg-base-200">
      <div className="card-body p-4">
        <div className="flex justify-between items-center">
          <h3 className="card-title text-base">{exercise.label}</h3>
          <span className="text-sm opacity-70">
            {exercise.sets}x{exercise.reps}
          </span>
        </div>
        <p className="text-2xl font-bold">
          {exercise.weight} {weightUnit}
        </p>
      </div>
    </div>
  );
}
