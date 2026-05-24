export interface LabWork {
  id: number;
  subject_id: number;
  title: string;
  description: string | null;
  deadline: string; // YYYY-MM-DD
  max_grade: number;
  is_teamwork: number; // 0 or 1
  theoretical_materials: string | null;
}

export type LabWorkInsert = Omit<LabWork, 'id'>;
export type LabWorkUpdate = Partial<LabWorkInsert>;