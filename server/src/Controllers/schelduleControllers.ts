import { Request, Response } from 'express';
import scheduleService from '../Services/scheldureService';

const getNumberFromQuery = (param: string | string[] | undefined): number | undefined => {
    if (!param) return undefined;
    const value = Array.isArray(param) ? param[0] : param;
    const num = parseInt(value);
    return isNaN(num) ? undefined : num;
};

export const getForSt = async (req: Request, res: Response): Promise<void> => {
    try {
        const groupId = getNumberFromQuery(req.query.groupId as string | string[] | undefined);

        if (!groupId) {
            res.status(400).json({
                success: false,
                message: 'Valid groupId is required'
            });
            return;
        }

        const schedule = await scheduleService.getScheduleForStudent(groupId);

        res.status(200).json({
            success: true,
            data: schedule,
            count: schedule.length
        });

    } catch (error) {
        console.error('Error in getForSt:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Internal server error'
        });
    }
};

export const getForTc = async (req: Request, res: Response): Promise<void> => {
    try {
        const teacherId = getNumberFromQuery(req.query.teacherId as string | string[] | undefined);

        if (!teacherId) {
            res.status(400).json({
                success: false,
                message: 'Valid teacherId is required'
            });
            return;
        }

        const schedule = await scheduleService.getScheduleForTeacher(teacherId);

        res.status(200).json({
            success: true,
            data: schedule,
            count: schedule.length
        });

    } catch (error) {
        console.error('Error in getForTc:', error);
        res.status(500).json({
            success: false,
            message: error instanceof Error ? error.message : 'Internal server error'
        });
    }
};

export const getAllSchedules = async (_req: Request, res: Response): Promise<void> => {
    try {
        const schedules = await scheduleService.getAllSchedules();
        res.status(200).json({ success: true, data: schedules });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const getScheduleById = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Valid id is required' });
            return;
        }

        const schedule = await scheduleService.getScheduleById(id);

        if (!schedule) {
            res.status(404).json({ success: false, message: 'Schedule not found' });
            return;
        }

        res.status(200).json({ success: true, data: schedule });
    } catch (error) {
        res.status(500).json({ success: false, message: (error as Error).message });
    }
};

export const createSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
        const scheduleData = req.body;
        const newSchedule = await scheduleService.createSchedule(scheduleData);
        res.status(201).json({ success: true, data: newSchedule });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const updateSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Valid id is required' });
            return;
        }

        const updateData = req.body;
        const updatedSchedule = await scheduleService.updateSchedule(id, updateData);
        res.status(200).json({ success: true, data: updatedSchedule });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};

export const deleteSchedule = async (req: Request, res: Response): Promise<void> => {
    try {
        const id = Number(req.params.id);

        if (isNaN(id)) {
            res.status(400).json({ success: false, message: 'Valid id is required' });
            return;
        }

        await scheduleService.deleteSchedule(id);
        res.status(200).json({ success: true, message: 'Schedule deleted successfully' });
    } catch (error) {
        res.status(400).json({ success: false, message: (error as Error).message });
    }
};