export type AttendanceStatus = 'present' | 'late' | 'absent';

export interface Attendance {
  id: number;
  student_id: number;
  schedule_id: number;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  reason: string | null;
}

export type AttendanceInsert = Omit<Attendance, 'id'>;
export type AttendanceUpdate = Partial<AttendanceInsert>;