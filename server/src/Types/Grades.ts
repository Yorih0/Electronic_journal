export type GradeType = 'lecture' | 'practice' | 'lab' | 'test';

export interface Grade {
  id: number;
  student_id: number;
  subject_id: number;
  date: string; // YYYY-MM-DD
  grade: number;
  type: GradeType;
  comment: string | null;
}

export type GradeInsert = Omit<Grade, 'id'>;
export type GradeUpdate = Partial<GradeInsert>;