import type { ExerciseLog, WeightUnit } from '../../types';
import { SetButton } from './SetButton';
import { WeightInput } from './WeightInput';

interface ExerciseTrackerProps {
  exercise: ExerciseLog;
  exerciseIndex: number;
  weightUnit: WeightUnit;
  increment: number;
  onSetUpdate: (exerciseIndex: number, setIndex: number, reps: number, completed: boolean) => void;
  onWeightChange: (exerciseIndex: number, weight: number) => void;
}

export function ExerciseTracker({
  exercise,
  exerciseIndex,
  weightUnit,
  increment,
  onSetUpdate,
  onWeightChange,
}: ExerciseTrackerProps) {
  return (
    <div className="card bg-base-200">
      <div className="card-body p-4 space-y-3">
        <h3 className="card-title text-base">{exercise.label}</h3>
        <WeightInput
          weight={exercise.actualWeight}
          unit={weightUnit}
          increment={increment}
          onChange={weight => onWeightChange(exerciseIndex, weight)}
        />
        <div className="flex gap-2 justify-center flex-wrap">
          {exercise.sets.map((set, setIndex) => (
            <SetButton
              key={setIndex}
              setIndex={setIndex}
              set={set}
              targetReps={5}
              onUpdate={(reps, completed) => onSetUpdate(exerciseIndex, setIndex, reps, completed)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
