import type React from "react";

interface ScreenProps {
  children: React.ReactNode;
}

export function Screen({ children }: ScreenProps) {
  return <div className="space-y-4">{children}</div>;
}
