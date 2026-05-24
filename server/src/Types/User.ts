export type UserRole = 'student' | 'teacher';

export interface User {
  id: number;
  email: string;
  password_hash: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  group_id: number | null;
  is_active: number; // 0 or 1
}

export type UserInsert = Omit<User, 'id' | 'is_active'> & { is_active?: number };
export type UserUpdate = Partial<Omit<User, 'id'>>;