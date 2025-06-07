import { Router } from 'express';
import {
    processTicket,
    processTicketPdf,
} from '../controllers/ticket.controller';
import { upload } from '../middlewares/multer.middleware';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/scan', authenticateToken, upload.single('image'), processTicket);
router.post(
    '/scan-pdf',
    upload.single('file'),
    authenticateToken,
    processTicketPdf,
);

export default router;
