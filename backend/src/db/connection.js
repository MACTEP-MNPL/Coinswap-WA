import { Pool } from 'pg'
import { log } from '../logger/log.js'
import { dbConfig } from '../config/dbConfig.js'
import { DatabaseError } from '../utils/errors.js'

const pool = new Pool(dbConfig);

pool.on('connect', () => {
  log.info('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
  log.error('Unexpected error on idle client', err);
  process.exit(-1);
});

const testConnection = async () => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    log.info('Database connection test successful:', result.rows[0]);
    client.release();
    return true;
  } catch (err) {
    log.error('Database connection test failed:', err);
    return false;
  }
};

// Enhanced query function that automatically wraps errors in DatabaseError
const query = async (text, params) => {
  try {
    return await pool.query(text, params);
  } catch (error) {
    // Log the original error for debugging
    log.error('Database query failed:', {
      query: text,
      params: params,
      error: error.message,
      code: error.code,
      detail: error.detail,
      stack: error.stack
    });

    // Convert to standardized DatabaseError
    let errorMessage = 'Database operation failed';
    
    // Provide more specific error messages based on PostgreSQL error codes
    if (error.code) {
      switch (error.code) {
        case '23505': // unique_violation
          errorMessage = 'Duplicate entry - record already exists';
          break;
        case '23503': // foreign_key_violation
          errorMessage = 'Referenced record does not exist';
          break;
        case '23502': // not_null_violation
          errorMessage = 'Required field cannot be empty';
          break;
        case '23514': // check_violation
          errorMessage = 'Data validation constraint failed';
          break;
        case '42P01': // undefined_table
          errorMessage = 'Database table not found';
          break;
        case '42703': // undefined_column
          errorMessage = 'Database column not found';
          break;
        case '08000': // connection_exception
        case '08003': // connection_does_not_exist
        case '08006': // connection_failure
          errorMessage = 'Database connection failed';
          break;
        case '53300': // too_many_connections
          errorMessage = 'Database server overloaded';
          break;
        default:
          errorMessage = 'Database operation failed';
      }
    }

    // Throw the standardized DatabaseError
    throw new DatabaseError(errorMessage, error);
  }
};

// Alternative query function for transactions (doesn't auto-wrap errors)
const rawQuery = (text, params) => {
  return pool.query(text, params);
};

export { pool, query, rawQuery, testConnection }
