export interface Group {
  id: number;
  name: string;
  year: number;
  specialization: string;
}

export type GroupInsert = Omit<Group, 'id'>;
export type GroupUpdate = Partial<GroupInsert>;