import expressWinston from 'express-winston'
import { log } from '../logger/log.js'

export const loggerMiddleware = expressWinston.logger({
    winstonInstance: log,
    meta: true,
    msg: "HTTP {{req.method}} {{req.url}}",
    expressFormat: true,
    colorize: false,
    ignoreRoute: (req, res) => {
      //return req.url === '/health';
    },
    requestWhitelist: ['url', 'headers', 'method', 'httpVersion', 'originalUrl', 'query'],
    responseWhitelist: ['statusCode', 'responseTime'],
    dynamicMeta: (req, res) => {
      return {
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection.remoteAddress,
      };
    }
  })
