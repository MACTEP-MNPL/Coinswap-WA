import { DatabaseError } from './errors.js';

export const asyncHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export const asyncHandlerWithContext = (fn, context = '') => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      // Add context to error for better debugging
      if (context) {
        error.context = context;
      }
      error.route = `${req.method} ${req.originalUrl}`;
      error.timestamp = new Date().toISOString();
      
      // Передаем ошибку в централизованный обработчик
      next(error);
    });
  };
};



// Note: Database operations now automatically wrap errors in DatabaseError via the query function
// No need for manual dbHandler wrapping anymore! 