export type StudentLabWorkStatus = 'submitted' | 'checked';

export interface StudentLabWork {
  id: number;
  lab_work_id: number;
  student_id: number;
  submission_date: string; // YYYY-MM-DD
  file_path: string;
  grade: number | null;
  comment: string | null;
  status: StudentLabWorkStatus;
}

export type StudentLabWorkInsert = Omit<StudentLabWork, 'id'>;
export type StudentLabWorkUpdate = Partial<StudentLabWorkInsert>;