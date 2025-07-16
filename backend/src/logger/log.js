import winston from 'winston';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const levels = {
  error: 0,
  info: 1,
  http: 2,
  d: 3,
}

const colors = {
  error: 'red',
  info: 'green',
  http: 'magenta',
  d: 'white',
}

winston.addColors(colors)

// Enhanced console format to show full messages including objects
const consoleLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.errors({ stack: true }),
  winston.format.printf((info) => {
    const { timestamp, level, message, stack, ...meta } = info;
    
    let logMessage = `${timestamp} ${level}: ${message}`;
    
    // Add stack trace for errors
    if (stack) {
      logMessage += `\n${stack}`;
    }
    
    // Add metadata if present
    const metaKeys = Object.keys(meta);
    if (metaKeys.length > 0) {
      logMessage += `\nMetadata: ${JSON.stringify(meta, null, 2)}`;
    }
    
    return logMessage;
  })
)

const fileLogFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
)

const transports = [
    new winston.transports.Console({
        format: consoleLogFormat,
    }),

    new winston.transports.File({
        filename: path.join(__dirname, '../../logs/error.log'),
        level: 'error',
        format: fileLogFormat,
        maxsize: 5242880,
        maxFiles: 5,
    }),
  
    new winston.transports.File({
        filename: path.join(__dirname, '../../logs/combined.log'),
        format: fileLogFormat,
        maxsize: 5242880,
        maxFiles: 5,
    }),
]

export const log = winston.createLogger({
  levels,
  format: fileLogFormat,
  transports,
  exitOnError: false,
})

const logsDir = path.join(__dirname, '../../logs')
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true })
}

process.on('unhandledRejection', (reason, promise) => {
  log.error('Unhandled Rejection at:', promise, 'reason:', reason)
})

process.on('uncaughtException', (error) => {
  log.error('Uncaught Exception:', error)
  process.exit(1)
})

global.log = log
