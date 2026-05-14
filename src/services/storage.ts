import type { AppData, UserSettings } from '../types';

const STORAGE_KEY = 'strength-training-data';

export const DEFAULT_SETTINGS: UserSettings = {
  weightUnit: 'lb',
  exercises: {
    squat: { id: 'squat', label: 'Squat', startWeight: 45, increment: 5, sets: 5, reps: 5 },
    bench: { id: 'bench', label: 'Bench Press', startWeight: 45, increment: 5, sets: 5, reps: 5 },
    ohp: { id: 'ohp', label: 'Overhead Press', startWeight: 45, increment: 5, sets: 5, reps: 5 },
    deadlift: { id: 'deadlift', label: 'Deadlift', startWeight: 95, increment: 10, sets: 1, reps: 5 },
    row: { id: 'row', label: 'Barbell Row', startWeight: 65, increment: 5, sets: 5, reps: 5 },
  },
};

const DEFAULT_DATA: AppData = {
  settings: DEFAULT_SETTINGS,
  workoutLogs: [],
};

export function loadData(): AppData {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return DEFAULT_DATA;
  try {
    return JSON.parse(raw) as AppData;
  } catch {
    return DEFAULT_DATA;
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function exportData(): string {
  return localStorage.getItem(STORAGE_KEY) ?? JSON.stringify(DEFAULT_DATA);
}

export function importData(json: string): AppData {
  const data = JSON.parse(json) as AppData;
  if (!data.settings || !data.workoutLogs) {
    throw new Error('Invalid data format');
  }
  saveData(data);
  return data;
}
