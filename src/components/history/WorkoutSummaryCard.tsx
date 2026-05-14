import type { WeightUnit, WorkoutLog } from '../../types';

interface WorkoutSummaryCardProps {
  workout: WorkoutLog;
  weightUnit: WeightUnit;
  onClick: () => void;
}

export function WorkoutSummaryCard({ workout, weightUnit, onClick }: WorkoutSummaryCardProps) {
  const allSuccess = workout.exercises.every(e =>
    e.sets.every(s => s.completed && s.reps >= 5),
  );

  return (
    <button className="card bg-base-200 w-full text-left" onClick={onClick}>
      <div className="card-body p-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-bold">
              Workout {workout.type}
              <span className={`ml-2 badge badge-sm ${allSuccess ? 'badge-success' : 'badge-warning'}`}>
                {allSuccess ? 'Complete' : 'Partial'}
              </span>
            </h3>
            <p className="text-sm opacity-70">
              {new Date(workout.date).toLocaleDateString(undefined, {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="text-right text-sm">
            {workout.exercises.map(e => (
              <div key={e.exerciseId}>
                {e.label} {e.actualWeight}{weightUnit}
              </div>
            ))}
          </div>
        </div>
      </div>
    </button>
  );
}
