export type LessonType = 'lecture' | 'practice' | 'lab' | 'control';

export interface SubjectProgram {
  id: number;
  subject_id: number;
  lesson_type: LessonType;
  topic: string;
  deadline: string | null; // YYYY-MM-DD
  materials: string | null;
}

export type SubjectProgramInsert = Omit<SubjectProgram, 'id'>;
export type SubjectProgramUpdate = Partial<SubjectProgramInsert>;