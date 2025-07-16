import { 
  isValidUserId, 
  isValidApplicationId, 
  getIdType, 
  validateIdByType,
  analyzeIdSecurity,
  generateIdReport,
  checkForCollisions,
  batchValidateIds
} from './idChecker.js';

import { createUserId, createApplicationId } from './idGenerator.js';

// Примеры использования функций валидации

console.log('=== ПРИМЕРЫ ИСПОЛЬЗОВАНИЯ ID CHECKER ===\n');

// 1. Генерируем тестовые ID
const testUserId = createUserId();
const testAppId = createApplicationId();

console.log('1. Сгенерированные ID:');
console.log(`User ID: ${testUserId}`);
console.log(`Application ID: ${testAppId}\n`);

// 2. Базовая валидация
console.log('2. Базовая валидация:');
console.log(`isValidUserId("${testUserId}"): ${isValidUserId(testUserId)}`);
console.log(`isValidApplicationId("${testAppId}"): ${isValidApplicationId(testAppId)}`);
console.log(`isValidUserId("INVALID123"): ${isValidUserId("INVALID123")}`);
console.log(`isValidUserId("ABC123XY"): ${isValidUserId("ABC123XY")}\n`);

// 3. Определение типа ID
console.log('3. Определение типа ID:');
console.log(`getIdType("${testUserId}"): ${getIdType(testUserId)}`);
console.log(`getIdType("${testAppId}"): ${getIdType(testAppId)}`);
console.log(`getIdType("invalid-id"): ${getIdType("invalid-id")}\n`);

// 4. Валидация с ожидаемым типом
console.log('4. Валидация с ожидаемым типом:');
const userValidation = validateIdByType(testUserId, 'user');
console.log('User ID validation:', JSON.stringify(userValidation, null, 2));

const appValidation = validateIdByType(testAppId, 'application');
console.log('Application ID validation:', JSON.stringify(appValidation, null, 2));

// 5. Анализ безопасности
console.log('\n5. Анализ безопасности:');
const securityAnalysis = analyzeIdSecurity(testUserId);
console.log(`Security analysis for ${testUserId}:`, JSON.stringify(securityAnalysis, null, 2));

// Тест с плохим ID
const weakId = "AAAA1111";
const weakSecurity = analyzeIdSecurity(weakId);
console.log(`\nSecurity analysis for weak ID "${weakId}":`, JSON.stringify(weakSecurity, null, 2));

// 6. Полный отчет об ID
console.log('\n6. Полный отчет об ID:');
const report = generateIdReport(testUserId);
console.log('ID Report:', JSON.stringify(report, null, 2));

// 7. Проверка коллизий
console.log('\n7. Проверка коллизий:');
const testIds = [testUserId, testAppId, testUserId, 'DUPLICATE1', 'DUPLICATE1'];
const collisionCheck = checkForCollisions(testIds);
console.log('Collision check:', JSON.stringify(collisionCheck, null, 2));

// 8. Batch валидация
console.log('\n8. Batch валидация:');
const batchData = [
  { id: testUserId, expectedType: 'user' },
  { id: testAppId, expectedType: 'application' },
  { id: 'INVALID123', expectedType: 'user' },
  { id: 'WEAK1111', expectedType: 'user' }
];

const batchResults = batchValidateIds(batchData);
console.log('Batch validation results:', JSON.stringify(batchResults, null, 2));

// 9. Практические примеры для middleware
console.log('\n9. Практические примеры для middleware:');

// Функция middleware для проверки user ID в параметрах
export const validateUserIdParam = (req, res, next) => {
  const { userId } = req.params;
  
  if (!isValidUserId(userId)) {
    return res.status(400).json({
      error: 'Invalid user ID format',
      details: 'User ID must be 8 characters long and contain only numbers and uppercase letters'
    });
  }
  
  // Дополнительная проверка безопасности
  const security = analyzeIdSecurity(userId);
  if (!security.isSecure) {
    return res.status(400).json({
      error: 'Insecure ID detected',
      issues: security.issues
    });
  }
  
  next();
};

// Функция middleware для проверки application ID
export const validateApplicationIdParam = (req, res, next) => {
  const { applicationId } = req.params;
  
  const validation = validateIdByType(applicationId, 'application');
  
  if (!validation.isValid) {
    return res.status(400).json({
      error: validation.message,
      expectedType: validation.expectedType,
      detectedType: validation.detectedType
    });
  }
  
  if (!validation.security.isSecure) {
    return res.status(400).json({
      error: 'Application ID failed security check',
      issues: validation.security.issues
    });
  }
  
  next();
};

// Функция для логирования подозрительных ID
export const logSuspiciousIds = (ids) => {
  const reports = ids.map(id => generateIdReport(id));
  const suspicious = reports.filter(report => !report.security.isSecure);
  
  if (suspicious.length > 0) {
    console.warn('🚨 Suspicious IDs detected:', suspicious);
  }
  
  return suspicious;
};

// Функция для проверки качества батча новых ID
export const validateNewIdBatch = (newIds, expectedType) => {
  console.log(`\nValidating batch of ${newIds.length} new ${expectedType} IDs...`);
  
  // Проверка на коллизии
  const collisions = checkForCollisions(newIds);
  if (collisions.hasCollisions) {
    console.error('❌ Collision detected in new ID batch!', collisions.duplicates);
    return false;
  }
  
  // Batch валидация
  const batchData = newIds.map(id => ({ id, expectedType }));
  const results = batchValidateIds(batchData);
  
  console.log(`✅ Validation rate: ${results.validationRate.toFixed(2)}%`);
  console.log(`🔒 Security issues: ${results.securityIssues}`);
  
  if (results.summary.commonIssues.length > 0) {
    console.warn('⚠️ Common issues found:', results.summary.commonIssues);
  }
  
  return results.summary.allValid && results.summary.allSecure;
};

// Запуск примеров только если файл выполняется напрямую
if (import.meta.url === `file://${process.argv[1]}`) {
  // Тест валидации батча новых ID
  const newUserIds = Array.from({ length: 5 }, () => createUserId());
  validateNewIdBatch(newUserIds, 'user');
  
  const newAppIds = Array.from({ length: 3 }, () => createApplicationId());
  validateNewIdBatch(newAppIds, 'application');
} 