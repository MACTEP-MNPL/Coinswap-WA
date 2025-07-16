import crypto from 'crypto';

// Константы для валидации
const USER_ID_PATTERN = /^[0-9A-Z]{8}$/;
const ULID_PATTERN = /^[0123456789ABCDEFGHJKMNPQRSTVWXYZ]{26}$/;

// Алфавиты для проверки
const USER_ID_ALPHABET = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ULID_ALPHABET = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';

/**
 * Проверяет, является ли строка валидным User ID
 * @param {string} id - ID для проверки
 * @returns {boolean} - true если ID валиден
 */
export const isValidUserId = (id) => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  // Проверяем длину и паттерн
  if (!USER_ID_PATTERN.test(id)) {
    return false;
  }
  
  // Проверяем, что все символы из правильного алфавита
  return id.split('').every(char => USER_ID_ALPHABET.includes(char));
};

/**
 * Проверяет, является ли строка валидным Application ID (ULID)
 * @param {string} id - ID для проверки
 * @returns {boolean} - true если ID валиден
 */
export const isValidApplicationId = (id) => {
  if (!id || typeof id !== 'string') {
    return false;
  }
  
  // Проверяем длину и паттерн ULID
  if (!ULID_PATTERN.test(id)) {
    return false;
  }
  
  // ULID валиден если соответствует паттерну и алфавиту
  return id.split('').every(char => ULID_ALPHABET.includes(char));
};

