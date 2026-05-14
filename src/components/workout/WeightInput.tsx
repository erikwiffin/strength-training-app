import type { WeightUnit } from '../../types';

interface WeightInputProps {
  weight: number;
  unit: WeightUnit;
  increment: number;
  onChange: (weight: number) => void;
}

export function WeightInput({ weight, unit, increment, onChange }: WeightInputProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        className="btn btn-sm btn-circle btn-outline"
        onClick={() => onChange(Math.max(0, weight - increment))}
      >
        -
      </button>
      <span className="text-xl font-bold min-w-[80px] text-center">
        {weight} {unit}
      </span>
      <button
        className="btn btn-sm btn-circle btn-outline"
        onClick={() => onChange(weight + increment)}
      >
        +
      </button>
    </div>
  );
}
