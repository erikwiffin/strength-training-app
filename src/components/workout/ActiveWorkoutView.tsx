import { useState } from "react";
import type {
  ExerciseConfig,
  ExerciseId,
  WeightUnit,
  WorkoutLog,
} from "../../types";
import { Header } from "../layout/Header";
import { ExerciseTracker } from "./ExerciseTracker";

interface ActiveWorkoutViewProps {
  workout: WorkoutLog;
  weightUnit: WeightUnit;
  exerciseConfigs: Record<ExerciseId, ExerciseConfig>;
  onUpdate: (updater: (log: WorkoutLog) => WorkoutLog) => void;
  onFinish: () => void;
  onCancel: () => void;
}

export function ActiveWorkoutView({
  workout,
  weightUnit,
  exerciseConfigs,
  onUpdate,
  onFinish,
  onCancel,
}: ActiveWorkoutViewProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const allSetsCompleted = workout.exercises.every((e) =>
    e.sets.every((s) => s.completed),
  );

  function handleSetUpdate(
    exerciseIndex: number,
    setIndex: number,
    reps: number,
    completed: boolean,
  ) {
    onUpdate((log) => ({
      ...log,
      exercises: log.exercises.map((e, ei) =>
        ei === exerciseIndex
          ? {
              ...e,
              sets: e.sets.map((s, si) =>
                si === setIndex ? { reps, completed } : s,
              ),
            }
          : e,
      ),
    }));
  }

  function handleWeightChange(exerciseIndex: number, weight: number) {
    onUpdate((log) => ({
      ...log,
      exercises: log.exercises.map((e, ei) =>
        ei === exerciseIndex ? { ...e, actualWeight: weight } : e,
      ),
    }));
  }

  return (
    <>
      <div className="space-y-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Workout {workout.type}</h2>
          <p className="text-sm opacity-70">
            {new Date(workout.date).toLocaleDateString(undefined, {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>

        <div className="space-y-2">
          {workout.exercises.map((exercise, index) => (
            <ExerciseTracker
              key={exercise.exerciseId}
              exercise={exercise}
              exerciseIndex={index}
              weightUnit={weightUnit}
              increment={exerciseConfigs[exercise.exerciseId].increment}
              onSetUpdate={handleSetUpdate}
              onWeightChange={handleWeightChange}
            />
          ))}
        </div>

        <button
          className={`btn btn-block btn-lg ${allSetsCompleted ? "btn-success" : "btn-primary"}`}
          onClick={onFinish}
        >
          Finish Workout
        </button>

        <button
          className="btn btn-ghost btn-block btn-sm text-error"
          onClick={() => setShowCancelConfirm(true)}
        >
          Cancel Workout
        </button>
      </div>

      {showCancelConfirm && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Cancel workout?</h3>
            <p className="py-4">
              This will delete all progress for this workout.
            </p>
            <div className="modal-action">
              <button
                className="btn"
                onClick={() => setShowCancelConfirm(false)}
              >
                Keep Going
              </button>
              <button className="btn btn-error" onClick={onCancel}>
                Cancel Workout
              </button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button onClick={() => setShowCancelConfirm(false)}>close</button>
          </form>
        </dialog>
      )}
    </>
  );
}
