import { useState, useRef, useCallback } from 'react';
import type { SetLog } from '../../types';

interface SetButtonProps {
  setIndex: number;
  set: SetLog;
  targetReps: number;
  onUpdate: (reps: number, completed: boolean) => void;
}

export function SetButton({ setIndex, set, targetReps, onUpdate }: SetButtonProps) {
  const [showPicker, setShowPicker] = useState(false);
  const longPressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const didLongPress = useRef(false);

  const handlePointerDown = useCallback(() => {
    didLongPress.current = false;
    longPressTimer.current = setTimeout(() => {
      didLongPress.current = true;
      setShowPicker(true);
    }, 500);
  }, []);

  const handlePointerUp = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    if (!didLongPress.current) {
      if (!set.completed) {
        onUpdate(targetReps, true);
      } else {
        onUpdate(0, false);
      }
    }
  }, [set.completed, targetReps, onUpdate]);

  const handlePointerLeave = useCallback(() => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  }, []);

  let colorClass = 'btn-ghost';
  let label = `${setIndex + 1}`;
  if (set.completed) {
    if (set.reps >= targetReps) {
      colorClass = 'btn-success';
    } else if (set.reps > 0) {
      colorClass = 'btn-warning';
    } else {
      colorClass = 'btn-error';
    }
    label = `${set.reps}`;
  }

  return (
    <div className="relative">
      <button
        className={`btn btn-circle btn-lg ${colorClass} text-lg font-bold`}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerLeave}
      >
        {label}
      </button>
      {showPicker && (
        <>
          <div className="fixed inset-0 z-20" onClick={() => setShowPicker(false)} />
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 bg-base-100 shadow-xl rounded-box p-2 flex gap-1">
            {Array.from({ length: targetReps + 1 }, (_, i) => targetReps - i).map(reps => (
              <button
                key={reps}
                className="btn btn-sm btn-circle"
                onClick={() => {
                  onUpdate(reps, true);
                  setShowPicker(false);
                }}
              >
                {reps}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
