import { Router } from 'express';
import { processTicket } from '../controllers/ticket.controller';
import { upload } from '../middlewares/multer.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/scan', authenticateToken, upload.single('image'), processTicket);

export default router;
