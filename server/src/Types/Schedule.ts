export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

export interface Schedule {
  id: number;
  group_id: number;
  subject_id: number;
  teacher_id: number;
  day_of_week: DayOfWeek;
  start_time: string; // HH:MM
  end_time: string;   // HH:MM
  room: string;
}

export type ScheduleInsert = Omit<Schedule, 'id'>;
export type ScheduleUpdate = Partial<ScheduleInsert>;