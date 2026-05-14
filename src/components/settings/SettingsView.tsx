import { useRef, useState } from "react";
import type {
  ExerciseConfig,
  ExerciseId,
  UserSettings,
  WeightUnit,
} from "../../types";
import {
  exportData,
  importData,
  loadData,
  saveData,
} from "../../services/storage";
import { ExerciseSettingsCard } from "./ExerciseSettingsCard";
import { Screen } from "../layout/Screen";
import { Header } from "../layout/Header";

const CONVERSION_RATIO = 2.25;

function roundToNearest(value: number, step: number) {
  return Math.round(value / step) * step;
}

function convertWeight(value: number, toUnit: WeightUnit) {
  if (toUnit === "kg") return roundToNearest(value / CONVERSION_RATIO, 2.5);
  return roundToNearest(value * CONVERSION_RATIO, 5);
}

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
  const clearHistoryModalRef = useRef<HTMLDialogElement>(null);
  const [importError, setImportError] = useState<string | null>(null);

  function handleUnitChange() {
    const newUnit = settings.weightUnit === "lb" ? "kg" : "lb";
    const convertedExercises = Object.fromEntries(
      Object.entries(settings.exercises).map(([id, config]) => [
        id,
        {
          ...config,
          startWeight: convertWeight(config.startWeight, newUnit),
          increment: convertWeight(config.increment, newUnit),
        },
      ]),
    ) as UserSettings["exercises"];
    onUpdateSettings({ weightUnit: newUnit, exercises: convertedExercises });
  }

  function handleClearHistory() {
    const data = loadData();
    saveData({ ...data, workoutLogs: [] });
    clearHistoryModalRef.current?.close();
    window.location.reload();
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
        <button className="btn btn-outline w-full" onClick={handleExport}>
          Export Backup
        </button>
        <button className="btn btn-outline w-full" onClick={handleImport}>
          Import Backup
        </button>
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
        <button
          className="btn btn-error btn-outline w-full"
          onClick={() => clearHistoryModalRef.current?.showModal()}
        >
          Clear History
        </button>
      </div>

      <dialog ref={clearHistoryModalRef} className="modal">
        <div className="modal-box">
          <h3 className="font-bold text-lg">Clear History</h3>
          <p className="py-4">
            This will permanently delete all workout logs. This cannot be
            undone.
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn">Cancel</button>
            </form>
            <button className="btn btn-error" onClick={handleClearHistory}>
              Clear History
            </button>
          </div>
        </div>
      </dialog>
    </Screen>
  );
}
