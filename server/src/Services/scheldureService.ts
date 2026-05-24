import { openDB } from '../Database/college';
import { Schedule, ScheduleInsert, ScheduleUpdate, DayOfWeek } from '../Types/Schedule';

class ScheduleService {

    async getScheduleForStudent(groupId: number): Promise<Schedule[]> {
        const db = await openDB();

        const schedules = await db.all<Schedule[]>(`
      SELECT 
        s.*,
        sub.name as subject_name,
        sub.short_name as subject_short_name,
        t.first_name as teacher_first_name,
        t.last_name as teacher_last_name,
        g.name as group_name
      FROM schedules s
      JOIN subjects sub ON s.subject_id = sub.id
      JOIN teachers t ON s.teacher_id = t.id
      JOIN groups g ON s.group_id = g.id
      WHERE s.group_id = ?
      ORDER BY 
        CASE s.day_of_week
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
        END,
        s.start_time
    `, groupId);

        await db.close();
        return schedules;
    }

    async getScheduleForTeacher(teacherId: number): Promise<Schedule[]> {
        const db = await openDB();

        const schedules = await db.all<Schedule[]>(`
      SELECT 
        s.*,
        sub.name as subject_name,
        g.name as group_name,
        g.course as group_course
      FROM schedules s
      JOIN subjects sub ON s.subject_id = sub.id
      JOIN groups g ON s.group_id = g.id
      WHERE s.teacher_id = ?
      ORDER BY 
        CASE s.day_of_week
          WHEN 'Monday' THEN 1
          WHEN 'Tuesday' THEN 2
          WHEN 'Wednesday' THEN 3
          WHEN 'Thursday' THEN 4
          WHEN 'Friday' THEN 5
          WHEN 'Saturday' THEN 6
          WHEN 'Sunday' THEN 7
        END,
        s.start_time
    `, teacherId);

        await db.close();
        return schedules;
    }

    async getAllSchedules(): Promise<Schedule[]> {
        const db = await openDB();

        const schedules = await db.all<Schedule[]>(`
      SELECT s.*, sub.name as subject_name, t.first_name, t.last_name, g.name as group_name
      FROM schedules s
      JOIN subjects sub ON s.subject_id = sub.id
      JOIN teachers t ON s.teacher_id = t.id
      JOIN groups g ON s.group_id = g.id
      ORDER BY s.day_of_week, s.start_time
    `);

        await db.close();
        return schedules;
    }

    async getScheduleById(id: number): Promise<Schedule | undefined> {
        const db = await openDB();

        const schedule = await db.get<Schedule>(
            'SELECT * FROM schedules WHERE id = ?',
            id
        );

        await db.close();
        return schedule;
    }

    async createSchedule(data: ScheduleInsert): Promise<Schedule> {
        const db = await openDB();

        const conflict = await db.get(
            `SELECT * FROM schedules 
       WHERE group_id = ? 
       AND day_of_week = ? 
       AND ((start_time <= ? AND end_time > ?) OR (start_time < ? AND end_time >= ?))`,
            data.group_id,
            data.day_of_week,
            data.start_time,
            data.start_time,
            data.end_time,
            data.end_time
        );

        if (conflict) {
            throw new Error('Time conflict: This group already has a lesson at this time');
        }

        const result = await db.run(
            `INSERT INTO schedules (group_id, subject_id, teacher_id, day_of_week, start_time, end_time, room)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            data.group_id,
            data.subject_id,
            data.teacher_id,
            data.day_of_week,
            data.start_time,
            data.end_time,
            data.room
        );

        const newSchedule = await db.get<Schedule>(
            'SELECT * FROM schedules WHERE id = ?',
            result.lastID
        );

        await db.close();

        if (!newSchedule) {
            throw new Error('Failed to create schedule');
        }

        return newSchedule;
    }

    async updateSchedule(id: number, data: ScheduleUpdate): Promise<Schedule> {
        const db = await openDB();

        const existing = await db.get('SELECT * FROM schedules WHERE id = ?', id);
        if (!existing) {
            throw new Error('Schedule not found');
        }

        const updates: string[] = [];
        const values: any[] = [];

        if (data.group_id !== undefined) {
            updates.push('group_id = ?');
            values.push(data.group_id);
        }
        if (data.subject_id !== undefined) {
            updates.push('subject_id = ?');
            values.push(data.subject_id);
        }
        if (data.teacher_id !== undefined) {
            updates.push('teacher_id = ?');
            values.push(data.teacher_id);
        }
        if (data.day_of_week !== undefined) {
            updates.push('day_of_week = ?');
            values.push(data.day_of_week);
        }
        if (data.start_time !== undefined) {
            updates.push('start_time = ?');
            values.push(data.start_time);
        }
        if (data.end_time !== undefined) {
            updates.push('end_time = ?');
            values.push(data.end_time);
        }
        if (data.room !== undefined) {
            updates.push('room = ?');
            values.push(data.room);
        }

        if (updates.length === 0) {
            throw new Error('No data to update');
        }

        values.push(id);

        await db.run(
            `UPDATE schedules SET ${updates.join(', ')} WHERE id = ?`,
            ...values
        );

        const updatedSchedule = await db.get<Schedule>(
            'SELECT * FROM schedules WHERE id = ?',
            id
        );

        await db.close();

        if (!updatedSchedule) {
            throw new Error('Failed to update schedule');
        }

        return updatedSchedule;
    }

    async deleteSchedule(id: number): Promise<void> {
        const db = await openDB();

        const result = await db.run('DELETE FROM schedules WHERE id = ?', id);

        await db.close();

        if (result.changes === 0) {
            throw new Error('Schedule not found');
        }
    }

    async getScheduleByDay(groupId: number, dayOfWeek: DayOfWeek): Promise<Schedule[]> {
        const db = await openDB();

        const schedules = await db.all<Schedule[]>(
            `SELECT s.*, sub.name as subject_name, t.first_name, t.last_name
       FROM schedules s
       JOIN subjects sub ON s.subject_id = sub.id
       JOIN teachers t ON s.teacher_id = t.id
       WHERE s.group_id = ? AND s.day_of_week = ?
       ORDER BY s.start_time`,
            groupId,
            dayOfWeek
        );

        await db.close();
        return schedules;
    }

    async getScheduleByRoom(room: string, dayOfWeek?: DayOfWeek): Promise<Schedule[]> {
        const db = await openDB();

        let query = `
      SELECT s.*, sub.name as subject_name, g.name as group_name, t.first_name, t.last_name
      FROM schedules s
      JOIN subjects sub ON s.subject_id = sub.id
      JOIN groups g ON s.group_id = g.id
      JOIN teachers t ON s.teacher_id = t.id
      WHERE s.room = ?
    `;
        const params: any[] = [room];

        if (dayOfWeek) {
            query += ' AND s.day_of_week = ?';
            params.push(dayOfWeek);
        }

        query += ' ORDER BY s.day_of_week, s.start_time';

        const schedules = await db.all<Schedule[]>(query, ...params);
        await db.close();

        return schedules;
    }
}

export default new ScheduleService();