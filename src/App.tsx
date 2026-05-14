import { useState } from "react";
import type { View } from "./types";
import { useAppData } from "./hooks/useAppData";
import { planWorkout, createWorkoutLog } from "./services/program";
import { BottomNav } from "./components/layout/BottomNav";
import { TodayView } from "./components/today/TodayView";
import { ActiveWorkoutView } from "./components/workout/ActiveWorkoutView";
import { HistoryView } from "./components/history/HistoryView";
import { WorkoutDetailView } from "./components/history/WorkoutDetailView";
import { SettingsView } from "./components/settings/SettingsView";

function App() {
  const [view, setView] = useState<View>({ name: "today" });
  const {
    data,
    updateSettings,
    saveWorkoutLog,
    updateWorkoutLog,
    deleteWorkoutLog,
  } = useAppData();

  const plan = planWorkout(data.settings, data.workoutLogs);
  const activeWorkout = data.workoutLogs.find((l) => l.completedAt === null);

  function handleStartWorkout() {
    const log = createWorkoutLog(plan, data.settings.weightUnit);
    saveWorkoutLog(log);
    setView({ name: "active-workout", workoutLogId: log.id });
  }

  function handleResumeWorkout(id: string) {
    setView({ name: "active-workout", workoutLogId: id });
  }

  function handleFinishWorkout(id: string) {
    updateWorkoutLog(id, (log) => ({
      ...log,
      completedAt: new Date().toISOString(),
    }));
    setView({ name: "today" });
  }

  function renderView() {
    switch (view.name) {
      case "today":
        return (
          <TodayView
            plan={plan}
            weightUnit={data.settings.weightUnit}
            activeWorkout={activeWorkout}
            onStartWorkout={handleStartWorkout}
            onResumeWorkout={handleResumeWorkout}
          />
        );
      case "active-workout": {
        const workout = data.workoutLogs.find(
          (l) => l.id === view.workoutLogId,
        );
        if (!workout) {
          setView({ name: "today" });
          return null;
        }
        return (
          <ActiveWorkoutView
            workout={workout}
            weightUnit={data.settings.weightUnit}
            exerciseConfigs={data.settings.exercises}
            onUpdate={(updater) => updateWorkoutLog(workout.id, updater)}
            onFinish={() => handleFinishWorkout(workout.id)}
            onCancel={() => {
              deleteWorkoutLog(workout.id);
              setView({ name: "today" });
            }}
          />
        );
      }
      case "history":
        return (
          <HistoryView
            logs={data.workoutLogs.filter((l) => l.completedAt !== null)}
            weightUnit={data.settings.weightUnit}
            onSelectWorkout={(id) =>
              setView({ name: "workout-detail", workoutLogId: id })
            }
          />
        );
      case "workout-detail": {
        const workout = data.workoutLogs.find(
          (l) => l.id === view.workoutLogId,
        );
        if (!workout) {
          setView({ name: "history" });
          return null;
        }
        return (
          <WorkoutDetailView
            workout={workout}
            weightUnit={data.settings.weightUnit}
            onBack={() => setView({ name: "history" })}
          />
        );
      }
      case "settings":
        return (
          <SettingsView
            settings={data.settings}
            onUpdateSettings={updateSettings}
          />
        );
    }
  }

  return (
    <div className="max-w-[600px] mx-auto px-3 pt-2 pb-20">
      {renderView()}
      <BottomNav current={view.name} onNavigate={setView} />
    </div>
  );
}

export default App;
