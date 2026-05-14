import { useState, useCallback } from 'react';
import type { AppData, UserSettings, WorkoutLog } from '../types';
import { loadData, saveData } from '../services/storage';

export function useAppData() {
  const [data, setData] = useState<AppData>(loadData);

  const persist = useCallback((next: AppData) => {
    setData(next);
    saveData(next);
  }, []);

  const updateSettings = useCallback(
    (patch: Partial<UserSettings>) => {
      persist({
        ...data,
        settings: { ...data.settings, ...patch },
      });
    },
    [data, persist],
  );

  const saveWorkoutLog = useCallback(
    (log: WorkoutLog) => {
      persist({
        ...data,
        workoutLogs: [...data.workoutLogs, log],
      });
    },
    [data, persist],
  );

  const updateWorkoutLog = useCallback(
    (id: string, updater: (log: WorkoutLog) => WorkoutLog) => {
      persist({
        ...data,
        workoutLogs: data.workoutLogs.map(l => (l.id === id ? updater(l) : l)),
      });
    },
    [data, persist],
  );

  const deleteWorkoutLog = useCallback(
    (id: string) => {
      persist({
        ...data,
        workoutLogs: data.workoutLogs.filter(l => l.id !== id),
      });
    },
    [data, persist],
  );

  return { data, updateSettings, saveWorkoutLog, updateWorkoutLog, deleteWorkoutLog };
}
