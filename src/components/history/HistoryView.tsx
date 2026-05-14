import type { WeightUnit, WorkoutLog } from "../../types";
import { Header } from "../layout/Header";
import { Screen } from "../layout/Screen";
import { WorkoutSummaryCard } from "./WorkoutSummaryCard";

interface HistoryViewProps {
  logs: WorkoutLog[];
  weightUnit: WeightUnit;
  onSelectWorkout: (id: string) => void;
}

export function HistoryView({
  logs,
  weightUnit,
  onSelectWorkout,
}: HistoryViewProps) {
  const sorted = [...logs].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  if (sorted.length === 0) {
    return (
      <div className="text-center py-12 opacity-70">
        <p className="text-lg">No workouts yet</p>
        <p className="text-sm">Complete your first workout to see it here.</p>
      </div>
    );
  }

  return (
    <Screen>
      <Header title="History" />
      <div className="space-y-2">
        {sorted.map((log) => (
          <WorkoutSummaryCard
            key={log.id}
            workout={log}
            weightUnit={weightUnit}
            onClick={() => onSelectWorkout(log.id)}
          />
        ))}
      </div>
    </Screen>
  );
}
