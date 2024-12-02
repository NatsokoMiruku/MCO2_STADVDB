import path from 'path';
import winston from 'winston';

// Create a logger instance
const logger = winston.createLogger({
    level: 'info', // Log level (info, error, warn, etc.)
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(), // Log to console
        new winston.transports.File({ filename: path.join('logs', 'transactionLogs.log') }) // Log to file
    ],
});

export default logger;
