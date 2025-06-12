import winston from 'winston';
import 'winston-daily-rotate-file';
import path from 'path';
import { Writable } from 'stream';

const logDir = path.join(__dirname, '../../logs');

let transports: winston.transport[] = [];

if (process.env.NODE_ENV === 'test') {
    // Silent stream que cumple con WritableStream
    const silentStream = new Writable({
        write(_chunk, _encoding, callback) {
            // No hacer nada con el log
            callback();
        },
    });

    transports = [
        new winston.transports.Stream({
            stream: silentStream,
        }),
    ];
} else {
    transports.push(
        new winston.transports.DailyRotateFile({
            dirname: logDir,
            filename: 'backend-%DATE%.log',
            datePattern: 'YYYY-MM-DD',
            zippedArchive: true,
            maxSize: '20m',
            maxFiles: '14d',
        }),
    );

    if (process.env.NODE_ENV !== 'production') {
        transports.push(
            new winston.transports.Console({
                format: winston.format.simple(),
            }),
        );
    }
}

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
    ),
    transports,
});
