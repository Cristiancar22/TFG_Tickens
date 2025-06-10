import { logger } from '../utils/logger';

const requiredVars = [
    'MONGO_URI',
    'PORT',
    'JWT_SECRET',
    'OCR_PORT',
    'LLM_PORT',
    'OCR_CONTAINER_NAME',
    'LLM_CONTAINER_NAME',
];

if (process.env.NODE_ENV !== 'test') {
    const missingVars = requiredVars.filter((v) => !process.env[v]);
    if (missingVars.length > 0) {
        logger.error(
            `[ENV] Faltan variables de entorno: ${missingVars.join(', ')}`,
            { timestamp: new Date().toISOString() },
        );
        process.exit(1);
    }
}

export const MONGO_URI = process.env.MONGO_URI;
export const PORT = process.env.PORT;
export const JWT_SECRET = process.env.JWT_SECRET;
export const OCR_PORT = process.env.OCR_PORT;
export const LLM_PORT = process.env.LLM_PORT;
export const OCR_CONTAINER_NAME = process.env.OCR_CONTAINER_NAME;
export const LLM_CONTAINER_NAME = process.env.LLM_CONTAINER_NAME;
