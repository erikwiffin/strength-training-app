import type { ExerciseConfig, WeightUnit } from '../../types';

interface ExerciseSettingsCardProps {
  config: ExerciseConfig;
  weightUnit: WeightUnit;
  onChange: (updated: ExerciseConfig) => void;
}

export function ExerciseSettingsCard({ config, weightUnit, onChange }: ExerciseSettingsCardProps) {
  return (
    <div className="card bg-base-200">
      <div className="card-body p-4 space-y-2">
        <h3 className="card-title text-base">{config.label}</h3>
        <div className="grid grid-cols-2 gap-3">
          <label className="form-control">
            <div className="label">
              <span className="label-text text-xs">Start Weight ({weightUnit})</span>
            </div>
            <input
              type="number"
              className="input input-bordered input-sm w-full"
              value={config.startWeight}
              min={0}
              step={config.increment}
              onChange={e => onChange({ ...config, startWeight: Number(e.target.value) })}
            />
          </label>
          <label className="form-control">
            <div className="label">
              <span className="label-text text-xs">Increment ({weightUnit})</span>
            </div>
            <input
              type="number"
              className="input input-bordered input-sm w-full"
              value={config.increment}
              min={0}
              step={weightUnit === 'lb' ? 5 : 2.5}
              onChange={e => onChange({ ...config, increment: Number(e.target.value) })}
            />
          </label>
        </div>
        <p className="text-xs opacity-50">
          {config.sets}x{config.reps}
        </p>
      </div>
    </div>
  );
}
