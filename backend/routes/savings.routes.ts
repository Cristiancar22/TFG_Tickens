import { Router } from 'express';
import {
    getSavingsGoal,
    createSavingsGoal,
    updateSavingsGoal,
    deleteSavingsGoal,
    getAllSavingsGoals,
    getTotalSavings,
    getSavingsRecommendations,
} from '../controllers/savings.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(authenticateToken);

router.get('/', getSavingsGoal);

router.get('/all', getAllSavingsGoals);

router.get('/total', getTotalSavings);

router.get('/recommendations', getSavingsRecommendations);

router.post('/', createSavingsGoal);

router.patch('/:id', updateSavingsGoal);

router.delete('/:id', deleteSavingsGoal);

export default router;
