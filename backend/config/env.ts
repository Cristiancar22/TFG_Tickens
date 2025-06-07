import { logger } from '../utils/logger';

const requiredVars = ['MONGO_URI', 'PORT', 'JWT_SECRET', 'OCR_PORT', 'LLM_PORT'];
const missingVars = requiredVars.filter((key) => !process.env[key]);

if (missingVars.length > 0) {
    logger.error(
        `[ENV] Faltan variables de entorno: ${missingVars.join(', ')}`,
    );
    process.exit(1);
}

export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const OCR_PORT = process.env.OCR_PORT;
export const LLM_PORT = process.env.LLM_PORT;
