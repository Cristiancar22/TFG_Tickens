import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';

const logDir = path.join(__dirname, '../../logs');

const transport = new winston.transports.DailyRotateFile({
    dirname: logDir,
    filename: 'backend-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d',
});

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports: [transport],
});

if (process.env.NODE_ENV !== 'production') {
    logger.add(
        new winston.transports.Console({
            format: winston.format.simple(),
        }),
    );
}
