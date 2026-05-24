export interface Subject {
  id: number;
  name: string;
  description: string | null;
  teacher_id: number;
}

export type SubjectInsert = Omit<Subject, 'id'>;
export type SubjectUpdate = Partial<SubjectInsert>;