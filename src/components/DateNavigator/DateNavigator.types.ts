import type { ReactNode } from "react";

export interface DateNavigatorProps {
  selectedDate: string; // YYYY-MM-DD
  onDateChange: (newDate: string) => void;
  badge?: ReactNode;
  className?: string;
}
