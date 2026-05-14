import { useRef, useState } from "react";
import type { ExerciseConfig, ExerciseId, UserSettings } from "../../types";
import { exportData, importData } from "../../services/storage";
import { ExerciseSettingsCard } from "./ExerciseSettingsCard";
import { Screen } from "../layout/Screen";
import { Header } from "../layout/Header";

interface SettingsViewProps {
  settings: UserSettings;
  onUpdateSettings: (patch: Partial<UserSettings>) => void;
}

const EXERCISE_ORDER: ExerciseId[] = [
  "squat",
  "bench",
  "ohp",
  "deadlift",
  "row",
];

export function SettingsView({
  settings,
  onUpdateSettings,
}: SettingsViewProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  function handleUnitChange() {
    onUpdateSettings({
      weightUnit: settings.weightUnit === "lb" ? "kg" : "lb",
    });
  }

  function handleExerciseChange(updated: ExerciseConfig) {
    onUpdateSettings({
      exercises: {
        ...settings.exercises,
        [updated.id]: updated,
      },
    });
  }

  function handleExport() {
    const json = exportData();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `strength-training-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleImport() {
    fileInputRef.current?.click();
  }

  function handleFileSelected(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importData(reader.result as string);
        setImportError(null);
        window.location.reload();
      } catch {
        setImportError("Invalid backup file");
      }
    };
    reader.readAsText(file);
  }

  return (
    <Screen>
      <Header title="Settings" />

      <div className="form-control">
        <label className="label cursor-pointer">
          <span className="label-text text-lg font-bold">Weight Unit</span>
          <div className="flex items-center gap-2">
            <span
              className={
                settings.weightUnit === "lb" ? "font-bold" : "opacity-50"
              }
            >
              lb
            </span>
            <input
              type="checkbox"
              className="toggle"
              checked={settings.weightUnit === "kg"}
              onChange={handleUnitChange}
            />
            <span
              className={
                settings.weightUnit === "kg" ? "font-bold" : "opacity-50"
              }
            >
              kg
            </span>
          </div>
        </label>
      </div>

      <h2 className="text-lg font-bold">Exercises</h2>
      <div className="space-y-2">
        {EXERCISE_ORDER.map((id) => (
          <ExerciseSettingsCard
            key={id}
            config={settings.exercises[id]}
            weightUnit={settings.weightUnit}
            onChange={handleExerciseChange}
          />
        ))}
      </div>

      <div className="divider" />

      <h2 className="text-lg font-bold">Data</h2>
      <div className="space-y-2">
        <div className="flex gap-3">
          <button className="btn btn-outline flex-1" onClick={handleExport}>
            Export Backup
          </button>
          <button className="btn btn-outline flex-1" onClick={handleImport}>
            Import Backup
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          className="hidden"
          onChange={handleFileSelected}
        />
        {importError && (
          <div className="alert alert-error">
            <span>{importError}</span>
          </div>
        )}
      </div>
    </Screen>
  );
}
