export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  rest_sec?: number;
  superset_with?: string;
}

export interface DayPlan {
  muscle_group: string;
  exercises: Exercise[];
}

export type WorkoutPlan = Record<string, DayPlan>;

export interface WorkoutLogs {
  [date: string]: {
    dayIndex: number;
    exercises: Record<string, (number | null)[]>;
  };
}
