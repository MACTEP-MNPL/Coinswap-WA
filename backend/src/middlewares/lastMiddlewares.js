import expressWinston from 'express-winston'
import { log } from '../logger/log.js'


export const lastMiddlewares = expressWinston.errorLogger({
    winstonInstance: log,
    meta: true,
    msg: "Error: {{err.message}}",
    requestWhitelist: ['url', 'headers', 'method', 'httpVersion', 'originalUrl', 'query'],
    dynamicMeta: function(req, res, err) {
      return {
        userAgent: req.get('User-Agent'),
        ip: req.ip || req.connection.remoteAddress,
        stack: err.stack
      };
    }
})