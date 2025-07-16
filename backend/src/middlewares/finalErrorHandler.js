import { AppError, ValidationError, NotFoundError, DatabaseError, AuthenticationError, AuthorizationError, RateLimitError, ExternalServiceError } from '../utils/errors.js';
import { log } from '../logger/log.js';

export const finalErrorHandler = (err, req, res, next) => {
  // Если ответ уже отправлен, делегируем Express
  if (res.headersSent) {
    return next(err);
  }


  log.error('Unhandled error caught by final error handler', {
    error: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
    ip: req.ip || req.connection?.remoteAddress,
    userAgent: req.get('User-Agent'),
    timestamp: new Date().toISOString(),
    requestId: req.id || null
  });

  let statusCode = 500;
  let message = 'Internal Server Error';
  let errorType = 'INTERNAL_ERROR';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    errorType = err.type;

    switch (true) {
      case err instanceof ValidationError:
        message = 'Invalid input data provided';
        break;
      
      case err instanceof NotFoundError:
        message = 'Requested resource not found';
        break;
      
      case err instanceof DatabaseError:
        message = 'Service temporarily unavailable';
        break;
      
      case err instanceof AuthenticationError:
        message = 'Authentication required';
        break;
      
      case err instanceof AuthorizationError:
        message = 'Access denied';
        break;
      
      case err instanceof RateLimitError:
        message = 'Too many requests - please try again later';
        break;
      
      case err instanceof ExternalServiceError:
        message = 'External service temporarily unavailable';
        break;
      
      default:
        message = 'An error occurred while processing your request';
      
    }
  } else {

    if (err.name === 'ValidationError') {
      statusCode = 400;
      message = 'Invalid input data';
      errorType = 'VALIDATION_ERROR';
    } else if (err.name === 'CastError') {
      statusCode = 400;
      message = 'Invalid request format';
      errorType = 'VALIDATION_ERROR';
    } else if (err.code === 11000) {
      statusCode = 409;
      message = 'Resource already exists';
      errorType = 'DUPLICATE_ERROR';
    } else if (err.name === 'SyntaxError' && err.message.includes('JSON')) {
      statusCode = 400;
      message = 'Invalid JSON format';
      errorType = 'SYNTAX_ERROR';
    } else if (err.code === 'ECONNREFUSED') {
      statusCode = 503;
      message = 'Service temporarily unavailable';
      errorType = 'SERVICE_UNAVAILABLE';
    } else {
      // Для всех остальных неизвестных ошибок
      message = 'Internal server error occurred';
      errorType = 'INTERNAL_ERROR';
    }
  }

  // Формируем безопасный ответ для клиента
  const errorResponse = {
    success: false,
    error: {
      type: errorType,
      message: message,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method
    }
  };

  // Добавляем request ID если есть
  if (req.id) {
    errorResponse.error.requestId = req.id;
  }

  // В режиме разработки можем добавить немного больше информации
  if (process.env.NODE_ENV === 'development') {
    // Но все равно не показываем stack trace в продакшене
    errorResponse.error.developmentInfo = {
      originalErrorName: err.name,
      // Только безопасная часть сообщения
      hint: err instanceof AppError ? 'Custom application error' : 'System error'
    };
  }

  // Отправляем ответ клиенту
  res.status(statusCode).json(errorResponse);
};

// Middleware для обработки 404 ошибок (если маршрут не найден)
export const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError('Route');
  next(error);
};

// Middleware для обработки uncaught exceptions и unhandled rejections
export const setupGlobalErrorHandlers = () => {
  // Обработка необработанных Promise rejections
  process.on('unhandledRejection', (reason, promise) => {
    log.error('Unhandled Promise Rejection', {
      reason: reason,
      promise: promise,
      timestamp: new Date().toISOString()
    });
    
    // В продакшене можно завершить процесс
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  });

  // Обработка необработанных исключений
  process.on('uncaughtException', (error) => {
    log.error('Uncaught Exception', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Завершаем процесс при критических ошибках
    process.exit(1);
  });
}; 