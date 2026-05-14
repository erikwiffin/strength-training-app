import type { PlannedWorkout, WeightUnit, WorkoutLog } from "../../types";
import { Header } from "../layout/Header";
import { Screen } from "../layout/Screen";
import { PlannedExerciseCard } from "./PlannedExerciseCard";

interface TodayViewProps {
  plan: PlannedWorkout;
  weightUnit: WeightUnit;
  activeWorkout: WorkoutLog | undefined;
  onStartWorkout: () => void;
  onResumeWorkout: (id: string) => void;
}

export function TodayView({
  plan,
  weightUnit,
  activeWorkout,
  onStartWorkout,
  onResumeWorkout,
}: TodayViewProps) {
  return (
    <Screen>
      <Header
        title={`Workout ${plan.type}`}
        subtitle={new Date(plan.date).toLocaleDateString(undefined, {
          weekday: "long",
          month: "long",
          day: "numeric",
        })}
      />

      <div className="space-y-2">
        {plan.exercises.map((exercise) => (
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
    </Screen>
  );
}
