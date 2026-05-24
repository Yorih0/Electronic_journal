// Routes/scheduleRoutes.ts
import { Router } from 'express';
import {
    getForSt,
    getForTc,
    getAllSchedules,
    getScheduleById,
    createSchedule,
    updateSchedule,
    deleteSchedule
} from '../Controllers/schelduleControllers';

const router = Router();

router.get('/student', getForSt);
router.get('/teacher', getForTc);

router.get('/', getAllSchedules);
router.get('/:id', getScheduleById);
router.post('/', createSchedule);
router.put('/:id', updateSchedule);
router.delete('/:id', deleteSchedule);

export default router;