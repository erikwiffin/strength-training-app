import type { WeightUnit, WorkoutLog } from "../../types";
import { Header } from "../layout/Header";
import { Screen } from "../layout/Screen";

interface WorkoutDetailViewProps {
  workout: WorkoutLog;
  weightUnit: WeightUnit;
  onBack: () => void;
}

export function WorkoutDetailView({
  workout,
  weightUnit,
  onBack,
}: WorkoutDetailViewProps) {
  return (
    <Screen>
      <Header
        title={`Workout ${workout.type}`}
        subtitle={new Date(workout.date).toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
        onBack={onBack}
      />
      {workout.exercises.map((exercise) => {
        const allSuccess = exercise.sets.every(
          (s) => s.completed && s.reps >= 5,
        );
        return (
          <div key={exercise.exerciseId} className="card bg-base-200">
            <div className="card-body p-3">
              <div className="flex justify-between items-center">
                <h3 className="card-title text-base">{exercise.label}</h3>
                <span className="text-lg font-bold">
                  {exercise.actualWeight} {weightUnit}
                </span>
              </div>
              <div className="flex gap-2 justify-center">
                {exercise.sets.map((set, i) => (
                  <div
                    key={i}
                    className={`badge badge-lg ${
                      set.completed && set.reps >= 5
                        ? "badge-success"
                        : set.completed && set.reps > 0
                          ? "badge-warning"
                          : set.completed
                            ? "badge-error"
                            : "badge-ghost"
                    }`}
                  >
                    {set.completed ? set.reps : "-"}
                  </div>
                ))}
              </div>
              {!allSuccess && (
                <p className="text-sm text-warning text-center">
                  Weight will stay at {exercise.actualWeight} {weightUnit} next
                  time
                </p>
              )}
            </div>
          </div>
        );
      })}
    </Screen>
  );
}
