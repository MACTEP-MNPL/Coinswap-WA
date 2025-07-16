// Custom error classes for different types of application errors

export class AppError extends Error {
  constructor(message, statusCode, isOperational = true) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    
    // Capture stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message, field = null, value = null) {
    super(message, 400);
    this.type = 'VALIDATION_ERROR';
    this.field = field;
    this.value = value;
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404);
    this.type = 'NOT_FOUND_ERROR';
  }
}

export class DatabaseError extends AppError {
  constructor(message, originalError = null) {
    super(message, 500);
    this.type = 'DATABASE_ERROR';
    this.originalError = originalError;
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Authentication failed') {
    super(message, 401);
    this.type = 'AUTHENTICATION_ERROR';
  }
}

export class AuthorizationError extends AppError {
  constructor(message = 'Access denied') {
    super(message, 403);
    this.type = 'AUTHORIZATION_ERROR';
  }
}

export class RateLimitError extends AppError {
  constructor(message = 'Too many requests') {
    super(message, 429);
    this.type = 'RATE_LIMIT_ERROR';
  }
}

export class ExternalServiceError extends AppError {
  constructor(service, message = 'External service error') {
    super(`${service}: ${message}`, 502);
    this.type = 'EXTERNAL_SERVICE_ERROR';
    this.service = service;
  }
} 