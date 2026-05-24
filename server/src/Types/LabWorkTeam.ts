export interface LabWorkTeam {
  id: number;
  lab_work_id: number;
  name: string;
}

export type LabWorkTeamInsert = Omit<LabWorkTeam, 'id'>;
export type LabWorkTeamUpdate = Partial<LabWorkTeamInsert>;