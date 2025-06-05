/**
 * @file validation.ts
 * @description Comprehensive security validation and sanitization system for Swiss tax calculator
 * 
 * This module provides robust security measures to protect against common attack vectors:
 * - Input validation and sanitization
 * - Protection against injection attacks
 * - Type checking and bounds validation
 * - Rate limiting
 * - Error sanitization
 * - Data integrity validation
 * - Audit logging
 */

import { PersonalInfo, FinancialInfo } from '../../types/TaxInfo';

// ==============================
// Security Constants and Safe Defaults
// ==============================

/**
 * Security constants for input validation and sanitization
 */
export const SECURITY_CONSTANTS = {
  // Numeric bounds
  MAX_SAFE_INCOME: 100_000_000, // 100 million CHF
  MIN_SAFE_INCOME: 0,
  MAX_SAFE_AGE: 120,
  MIN_SAFE_AGE: 0,
  MAX_SAFE_CHILDREN: 50,
  MIN_SAFE_CHILDREN: 0,
  MAX_SAFE_WEALTH: 1_000_000_000, // 1 billion CHF
  MIN_SAFE_WEALTH: 0,
  
  // String limits
  MAX_STRING_LENGTH: 255,
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: 60000, // 1 minute
  RATE_LIMIT_MAX_REQUESTS: 100,
  
  // Regex patterns for validation
  SAFE_STRING_PATTERN: /^[a-zA-Z0-9\s\-\.,äöüÄÖÜàéèêç]+$/,
  ZIP_CODE_PATTERN: /^\d{4,5}$/,
  CANTON_CODE_PATTERN: /^[A-Z]{2}$/,
  
  // Audit logging
  LOG_LEVELS: {
    INFO: 'INFO',
    WARN: 'WARN',
    ERROR: 'ERROR',
    SECURITY: 'SECURITY'
  },
  
  // Error messages
  ERROR_MESSAGES: {
    INVALID_INPUT: 'Invalid input provided',
    RATE_LIMIT_EXCEEDED: 'Rate limit exceeded, please try again later',
    VALIDATION_FAILED: 'Input validation failed',
    SANITIZATION_FAILED: 'Input sanitization failed',
    INTEGRITY_FAILED: 'Data integrity check failed'
  }
};

// ==============================
// Type Definitions
// ==============================

/**
 * Validation result interface
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * Security event for audit logging
 */
export interface SecurityEvent {
  timestamp: number;
  level: string;
  message: string;
  data?: any;
  userId?: string;
  ipAddress?: string;
}

/**
 * Rate limiter entry
 */
interface RateLimiterEntry {
  count: number;
  resetTime: number;
}

// ==============================
// Input Validation
// ==============================

/**
 * Validates a number is within safe bounds
 * 
 * @param value The number to validate
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 * @returns Validation result
 */
export function validateNumber(
  value: any, 
  min: number = Number.MIN_SAFE_INTEGER, 
  max: number = Number.MAX_SAFE_INTEGER
): ValidationResult {
  const errors: string[] = [];
  
  // Type check
  if (typeof value !== 'number') {
    errors.push(`Value must be a number, got ${typeof value}`);
    return { isValid: false, errors };
  }
  
  // Check for NaN, Infinity
  if (Number.isNaN(value) || !Number.isFinite(value)) {
    errors.push('Value must be a valid finite number');
    return { isValid: false, errors };
  }
  
  // Bounds check
  if (value < min) {
    errors.push(`Value ${value} is below minimum allowed value ${min}`);
  }
  
  if (value > max) {
    errors.push(`Value ${value} exceeds maximum allowed value ${max}`);
  }
  
  return { 
    isValid: errors.length === 0, 
    errors 
  };
}

/**
 * Validates a string against security constraints
 * 
 * @param value The string to validate
 * @param maxLength Maximum allowed length
 * @param pattern Regex pattern for validation
 * @returns Validation result
 */
export function validateString(
  value: any,
  maxLength: number = SECURITY_CONSTANTS.MAX_STRING_LENGTH,
  pattern: RegExp = SECURITY_CONSTANTS.SAFE_STRING_PATTERN
): ValidationResult {
  const errors: string[] = [];
  
  // Type check
  if (typeof value !== 'string') {
    errors.push(`Value must be a string, got ${typeof value}`);
    return { isValid: false, errors };
  }
  
  // Length check
  if (value.length > maxLength) {
    errors.push(`String length ${value.length} exceeds maximum allowed length ${maxLength}`);
  }
  
  // Pattern check
  if (!pattern.test(value)) {
    errors.push('String contains invalid characters');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates an enum value
 * 
 * @param value The value to validate
 * @param allowedValues Array of allowed values
 * @returns Validation result
 */
export function validateEnum<T>(value: any, allowedValues: T[]): ValidationResult {
  const errors: string[] = [];
  
  if (!allowedValues.includes(value as T)) {
    errors.push(`Value "${value}" is not one of the allowed values: ${allowedValues.join(', ')}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates a date is reasonable
 * 
 * @param value The date to validate
 * @param minDate Minimum allowed date
 * @param maxDate Maximum allowed date
 * @returns Validation result
 */
export function validateDate(
  value: any,
  minDate: Date = new Date(1900, 0, 1),
  maxDate: Date = new Date(2100, 0, 1)
): ValidationResult {
  const errors: string[] = [];
  
  // Type check
  if (!(value instanceof Date) && typeof value !== 'string' && typeof value !== 'number') {
    errors.push(`Value must be a Date, string, or number, got ${typeof value}`);
    return { isValid: false, errors };
  }
  
  // Convert to Date if string or number
  const date = value instanceof Date ? value : new Date(value);
  
  // Check if valid date
  if (isNaN(date.getTime())) {
    errors.push('Value is not a valid date');
    return { isValid: false, errors };
  }
  
  // Bounds check
  if (date < minDate) {
    errors.push(`Date ${date.toISOString()} is before minimum allowed date ${minDate.toISOString()}`);
  }
  
  if (date > maxDate) {
    errors.push(`Date ${date.toISOString()} is after maximum allowed date ${maxDate.toISOString()}`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates personal information object
 * 
 * @param personalInfo The personal info object to validate
 * @returns Validation result
 */
export function validatePersonalInfo(personalInfo: PersonalInfo): ValidationResult {
  const errors: string[] = [];
  
  // Check required fields
  if (!personalInfo) {
    return { isValid: false, errors: ['Personal information is required'] };
  }
  
  // Validate age
  const ageValidation = validateNumber(
    Number(personalInfo.age), 
    SECURITY_CONSTANTS.MIN_SAFE_AGE, 
    SECURITY_CONSTANTS.MAX_SAFE_AGE
  );
  if (!ageValidation.isValid) {
    errors.push(...ageValidation.errors.map(e => `age: ${e}`));
  }
  
  // Validate marital status
  const maritalStatusValidation = validateEnum(
    personalInfo.maritalStatus,
    ['single', 'married', 'registered_partnership', 'divorced', 'widowed']
  );
  if (!maritalStatusValidation.isValid) {
    errors.push(...maritalStatusValidation.errors.map(e => `maritalStatus: ${e}`));
  }
  
  // Validate canton
  if (!personalInfo.canton) {
    errors.push('canton: Canton is required');
  } else {
    const cantonValidation = validateString(personalInfo.canton);
    if (!cantonValidation.isValid) {
      errors.push(...cantonValidation.errors.map(e => `canton: ${e}`));
    }
  }
  
  // Validate municipality
  if (!personalInfo.municipality) {
    errors.push('municipality: Municipality is required');
  } else {
    const municipalityValidation = validateString(personalInfo.municipality);
    if (!municipalityValidation.isValid) {
      errors.push(...municipalityValidation.errors.map(e => `municipality: ${e}`));
    }
  }
  
  // Validate children count if hasChildren is true
  if (personalInfo.hasChildren) {
    const childrenValidation = validateNumber(
      personalInfo.numberOfChildren,
      SECURITY_CONSTANTS.MIN_SAFE_CHILDREN,
      SECURITY_CONSTANTS.MAX_SAFE_CHILDREN
    );
    if (!childrenValidation.isValid) {
      errors.push(...childrenValidation.errors.map(e => `numberOfChildren: ${e}`));
    }
  }
  
  // Validate religion
  const religionValidation = validateEnum(
    personalInfo.religion,
    ['roman_catholic', 'protestant', 'other', 'none']
  );
  if (!religionValidation.isValid) {
    errors.push(...religionValidation.errors.map(e => `religion: ${e}`));
  }
  
  // Validate spouse if married or in registered partnership
  if ((personalInfo.maritalStatus === 'married' || personalInfo.maritalStatus === 'registered_partnership') 
      && personalInfo.spouse) {
    
    // Validate spouse age
    const spouseAgeValidation = validateNumber(
      Number(personalInfo.spouse.age),
      SECURITY_CONSTANTS.MIN_SAFE_AGE,
      SECURITY_CONSTANTS.MAX_SAFE_AGE
    );
    if (!spouseAgeValidation.isValid) {
      errors.push(...spouseAgeValidation.errors.map(e => `spouse.age: ${e}`));
    }
    
    // Validate spouse religion
    const spouseReligionValidation = validateEnum(
      personalInfo.spouse.religion,
      ['roman_catholic', 'protestant', 'other', 'none']
    );
    if (!spouseReligionValidation.isValid) {
      errors.push(...spouseReligionValidation.errors.map(e => `spouse.religion: ${e}`));
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * Validates financial information object
 * 
 * @param financialInfo The financial info object to validate
 * @returns Validation result
 */
export function validateFinancialInfo(financialInfo: FinancialInfo): ValidationResult {
  const errors: string[] = [];
  
  // Check required fields
  if (!financialInfo) {
    return { isValid: false, errors: ['Financial information is required'] };
  }
  
  // Validate yearly income
  const incomeValidation = validateNumber(
    financialInfo.yearlyIncome,
    SECURITY_CONSTANTS.MIN_SAFE_INCOME,
    SECURITY_CONSTANTS.MAX_SAFE_INCOME
  );
  if (!incomeValidation.isValid) {
    errors.push(...incomeValidation.errors.map(e => `yearlyIncome: ${e}`));
  }
  
  // Validate spouse yearly income if provided
  if (financialInfo.spouseYearlyIncome !== undefined) {
    const spouseIncomeValidation = validateNumber(
      financialInfo.spouseYearlyIncome,
      SECURITY_CONSTANTS.MIN_SAFE_INCOME,
      SECURITY_CONSTANTS.MAX_SAFE_INCOME
    );
    if (!spouseIncomeValidation.isValid) {
      errors.push(...spouseIncomeValidation.errors.map(e => `spouseYearlyIncome: ${e}`));
    }
  }
  
  // Validate wealth amount
  const wealthValidation = validateNumber(
    financialInfo.wealthAmount,
    SECURITY_CONSTANTS.MIN_SAFE_WEALTH,
    SECURITY_CONSTANTS.MAX_SAFE_WEALTH
  );
  if (!wealthValidation.isValid) {
    errors.push(...wealthValidation.errors.map(e => `wealthAmount: ${e}`));
  }
  
  // Validate spouse wealth amount if provided
  if (financialInfo.spouseWealthAmount !== undefined) {
    const spouseWealthValidation = validateNumber(
      financialInfo.spouseWealthAmount,
      SECURITY_CONSTANTS.MIN_SAFE_WEALTH,
      SECURITY_CONSTANTS.MAX_SAFE_WEALTH
    );
    if (!spouseWealthValidation.isValid) {
      errors.push(...spouseWealthValidation.errors.map(e => `spouseWealthAmount: ${e}`));
    }
  }
  
  // Validate mortgage debt
  const mortgageValidation = validateNumber(
    financialInfo.mortgageDebt,
    0,
    SECURITY_CONSTANTS.MAX_SAFE_WEALTH
  );
  if (!mortgageValidation.isValid) {
    errors.push(...mortgageValidation.errors.map(e => `mortgageDebt: ${e}`));
  }
  
  // Validate pension contributions
  const pensionValidation = validateNumber(
    financialInfo.pensionContributions,
    0,
    financialInfo.yearlyIncome * 0.5 // Max 50% of income
  );
  if (!pensionValidation.isValid) {
    errors.push(...pensionValidation.errors.map(e => `pensionContributions: ${e}`));
  }
  
  // Validate Pillar 3a contributions
  const pillar3aValidation = validateNumber(
    financialInfo.pillar3aContributions,
    0,
    50000 // Higher than any possible limit
  );
  if (!pillar3aValidation.isValid) {
    errors.push(...pillar3aValidation.errors.map(e => `pillar3aContributions: ${e}`));
  }
  
  // Validate charitable donations
  const donationsValidation = validateNumber(
    financialInfo.charitableDonations,
    0,
    financialInfo.yearlyIncome // Max 100% of income
  );
  if (!donationsValidation.isValid) {
    errors.push(...donationsValidation.errors.map(e => `charitableDonations: ${e}`));
  }
  
  // Validate total wealth if provided
  if (financialInfo.totalWealth !== undefined) {
    const totalWealthValidation = validateNumber(
      financialInfo.totalWealth,
      0,
      SECURITY_CONSTANTS.MAX_SAFE_WEALTH
    );
    if (!totalWealthValidation.isValid) {
      errors.push(...totalWealthValidation.errors.map(e => `totalWealth: ${e}`));
    }
  }
  
  // Validate total liabilities if provided
  if (financialInfo.totalLiabilities !== undefined) {
    const liabilitiesValidation = validateNumber(
      financialInfo.totalLiabilities,
      0,
      SECURITY_CONSTANTS.MAX_SAFE_WEALTH
    );
    if (!liabilitiesValidation.isValid) {
      errors.push(...liabilitiesValidation.errors.map(e => `totalLiabilities: ${e}`));
    }
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
}

// ==============================
// String Sanitization (XSS Protection)
// ==============================

/**
 * Sanitizes a string to prevent XSS attacks
 * 
 * @param input The string to sanitize
 * @returns Sanitized string
 */
export function sanitizeString(input: string): string {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    // Replace HTML special characters with their entity equivalents
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    // Remove potential script injections
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    // Remove potential iframe injections
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
    // Remove potential event handlers
    .replace(/on\w+="[^"]*"/g, '')
    .replace(/on\w+='[^']*'/g, '')
    .replace(/on\w+=\w+/g, '');
}

/**
 * Sanitizes a number to ensure it's a safe number
 * 
 * @param input The number to sanitize
 * @param defaultValue Default value if input is invalid
 * @param min Minimum allowed value
 * @param max Maximum allowed value
 * @returns Sanitized number
 */
export function sanitizeNumber(
  input: any, 
  defaultValue: number = 0, 
  min: number = Number.MIN_SAFE_INTEGER, 
  max: number = Number.MAX_SAFE_INTEGER
): number {
  // Convert to number if string
  let num = typeof input === 'string' ? parseFloat(input) : input;
  
  // Check if valid number
  if (typeof num !== 'number' || isNaN(num) || !isFinite(num)) {
    return defaultValue;
  }
  
  // Clamp to range
  return Math.min(Math.max(num, min), max);
}

/**
 * Sanitizes personal information object
 * 
 * @param personalInfo The personal info object to sanitize
 * @returns Sanitized personal info object
 */
export function sanitizePersonalInfo(personalInfo: PersonalInfo): PersonalInfo {
  if (!personalInfo) {
    throw new Error(SECURITY_CONSTANTS.ERROR_MESSAGES.INVALID_INPUT);
  }
  
  return {
    age: sanitizeNumber(personalInfo.age, 30, SECURITY_CONSTANTS.MIN_SAFE_AGE, SECURITY_CONSTANTS.MAX_SAFE_AGE),
    maritalStatus: personalInfo.maritalStatus,
    canton: sanitizeString(personalInfo.canton),
    municipality: sanitizeString(personalInfo.municipality),
    hasChildren: !!personalInfo.hasChildren,
    numberOfChildren: sanitizeNumber(
      personalInfo.numberOfChildren, 
      0, 
      SECURITY_CONSTANTS.MIN_SAFE_CHILDREN, 
      SECURITY_CONSTANTS.MAX_SAFE_CHILDREN
    ),
    religion: personalInfo.religion,
    ...(personalInfo.spouse && {
      spouse: {
        age: sanitizeNumber(personalInfo.spouse.age, 30, SECURITY_CONSTANTS.MIN_SAFE_AGE, SECURITY_CONSTANTS.MAX_SAFE_AGE),
        religion: personalInfo.spouse.religion
      }
    }),
    isWithholdingTaxEligible: !!personalInfo.isWithholdingTaxEligible
  };
}

/**
 * Sanitizes financial information object
 * 
 * @param financialInfo The financial info object to sanitize
 * @returns Sanitized financial info object
 */
export function sanitizeFinancialInfo(financialInfo: FinancialInfo): FinancialInfo {
  if (!financialInfo) {
    throw new Error(SECURITY_CONSTANTS.ERROR_MESSAGES.INVALID_INPUT);
  }
  
  return {
    yearlyIncome: sanitizeNumber(
      financialInfo.yearlyIncome, 
      0, 
      SECURITY_CONSTANTS.MIN_SAFE_INCOME, 
      SECURITY_CONSTANTS.MAX_SAFE_INCOME
    ),
    spouseYearlyIncome: financialInfo.spouseYearlyIncome !== undefined 
      ? sanitizeNumber(
          financialInfo.spouseYearlyIncome, 
          0, 
          SECURITY_CONSTANTS.MIN_SAFE_INCOME, 
          SECURITY_CONSTANTS.MAX_SAFE_INCOME
        ) 
      : undefined,
    wealthAmount: sanitizeNumber(
      financialInfo.wealthAmount, 
      0, 
      SECURITY_CONSTANTS.MIN_SAFE_WEALTH, 
      SECURITY_CONSTANTS.MAX_SAFE_WEALTH
    ),
    spouseWealthAmount: financialInfo.spouseWealthAmount !== undefined 
      ? sanitizeNumber(
          financialInfo.spouseWealthAmount, 
          0, 
          SECURITY_CONSTANTS.MIN_SAFE_WEALTH, 
          SECURITY_CONSTANTS.MAX_SAFE_WEALTH
        ) 
      : undefined,
    mortgageDebt: sanitizeNumber(financialInfo.mortgageDebt, 0, 0, SECURITY_CONSTANTS.MAX_SAFE_WEALTH),
    pensionContributions: sanitizeNumber(
      financialInfo.pensionContributions, 
      0, 
      0, 
      Math.max(financialInfo.yearlyIncome * 0.5, 50000)
    ),
    spousePensionContributions: financialInfo.spousePensionContributions !== undefined 
      ? sanitizeNumber(
          financialInfo.spousePensionContributions, 
          0, 
          0, 
          Math.max((financialInfo.spouseYearlyIncome || 0) * 0.5, 50000)
        ) 
      : undefined,
    pillar3aContributions: sanitizeNumber(financialInfo.pillar3aContributions, 0, 0, 50000),
    spousePillar3aContributions: financialInfo.spousePillar3aContributions !== undefined 
      ? sanitizeNumber(financialInfo.spousePillar3aContributions, 0, 0, 50000) 
      : undefined,
    charitableDonations: sanitizeNumber(
      financialInfo.charitableDonations, 
      0, 
      0, 
      financialInfo.yearlyIncome
    ),
    propertyOwnership: !!financialInfo.propertyOwnership,
    selfEmployed: !!financialInfo.selfEmployed,
    spouseSelfEmployed: financialInfo.spouseSelfEmployed !== undefined 
      ? !!financialInfo.spouseSelfEmployed 
      : undefined,
    currentTaxBurden: sanitizeNumber(financialInfo.currentTaxBurden, 0, 0, SECURITY_CONSTANTS.MAX_SAFE_INCOME),
    totalWealth: financialInfo.totalWealth !== undefined 
      ? sanitizeNumber(
          financialInfo.totalWealth, 
          0, 
          SECURITY_CONSTANTS.MIN_SAFE_WEALTH, 
          SECURITY_CONSTANTS.MAX_SAFE_WEALTH
        ) 
      : undefined,
    totalLiabilities: financialInfo.totalLiabilities !== undefined 
      ? sanitizeNumber(
          financialInfo.totalLiabilities, 
          0, 
          0, 
          SECURITY_CONSTANTS.MAX_SAFE_WEALTH
        ) 
      : undefined,
    additionalDeductions: financialInfo.additionalDeductions !== undefined 
      ? sanitizeNumber(
          financialInfo.additionalDeductions, 
          0, 
          0, 
          financialInfo.yearlyIncome * 0.5
        ) 
      : undefined
  };
}

// ==============================
// Rate Limiting
// ==============================

// In-memory storage for rate limiting
const rateLimitStore: Map<string, RateLimiterEntry> = new Map();

/**
 * Rate limiter to prevent abuse
 * 
 * @param key Identifier for the rate limit (e.g., IP address, user ID)
 * @param maxRequests Maximum number of requests allowed in the window
 * @param windowMs Time window in milliseconds
 * @returns Whether the request is allowed
 */
export function checkRateLimit(
  key: string,
  maxRequests: number = SECURITY_CONSTANTS.RATE_LIMIT_MAX_REQUESTS,
  windowMs: number = SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS
): boolean {
  const now = Date.now();
  
  // Get current entry or create new one
  let entry = rateLimitStore.get(key);
  if (!entry) {
    entry = { count: 0, resetTime: now + windowMs };
    rateLimitStore.set(key, entry);
  }
  
  // Reset if window has passed
  if (now > entry.resetTime) {
    entry.count = 0;
    entry.resetTime = now + windowMs;
  }
  
  // Check if limit exceeded
  if (entry.count >= maxRequests) {
    // Log rate limit exceeded
    logSecurityEvent({
      level: SECURITY_CONSTANTS.LOG_LEVELS.SECURITY,
      message: `Rate limit exceeded for ${key}`,
      data: { key, count: entry.count, maxRequests, windowMs }
    });
    return false;
  }
  
  // Increment count and allow request
  entry.count++;
  return true;
}

/**
 * Clears expired rate limit entries to prevent memory leaks
 */
export function cleanupRateLimiter(): void {
  const now = Date.now();
  
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Schedule periodic cleanup
if (typeof window !== 'undefined') {
  // Browser environment
  setInterval(cleanupRateLimiter, SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS);
} else if (typeof process !== 'undefined') {
  // Node.js environment
  setInterval(cleanupRateLimiter, SECURITY_CONSTANTS.RATE_LIMIT_WINDOW_MS);
}

// ==============================
// Error Sanitization
// ==============================

/**
 * Sanitizes error messages to prevent information leakage
 * 
 * @param error The error to sanitize
 * @returns Sanitized error message
 */
export function sanitizeError(error: any): string {
  // Default safe error message
  const safeErrorMessage = 'An error occurred. Please try again later.';
  
  if (!error) {
    return safeErrorMessage;
  }
  
  // If it's a validation error, return it safely
  if (error.isValidationError) {
    return sanitizeString(error.message);
  }
  
  // For security errors, return them safely
  if (error.isSecurityError) {
    return sanitizeString(error.message);
  }
  
  // For all other errors, log them but return a generic message
  logSecurityEvent({
    level: SECURITY_CONSTANTS.LOG_LEVELS.ERROR,
    message: 'Error sanitized',
    data: {
      originalError: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }
  });
  
  return safeErrorMessage;
}

/**
 * Creates a validation error
 * 
 * @param message Error message
 * @returns Validation error
 */
export function createValidationError(message: string): Error & { isValidationError: boolean } {
  const error = new Error(message) as Error & { isValidationError: boolean };
  error.isValidationError = true;
  return error;
}

/**
 * Creates a security error
 * 
 * @param message Error message
 * @returns Security error
 */
export function createSecurityError(message: string): Error & { isSecurityError: boolean } {
  const error = new Error(message) as Error & { isSecurityError: boolean };
  error.isSecurityError = true;
  
  // Log security errors
  logSecurityEvent({
    level: SECURITY_CONSTANTS.LOG_LEVELS.SECURITY,
    message: `Security error: ${message}`
  });
  
  return error;
}

// ==============================
// Data Integrity
// ==============================

/**
 * Simple hash function for data integrity checks
 * 
 * @param data Data to hash
 * @returns Hash string
 */
export function hashData(data: any): string {
  try {
    // Convert data to string
    const str = typeof data === 'string' ? data : JSON.stringify(data);
    
    // Simple hash algorithm (not cryptographically secure, but good enough for integrity checks)
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    
    return hash.toString(16);
  } catch (error) {
    logSecurityEvent({
      level: SECURITY_CONSTANTS.LOG_LEVELS.ERROR,
      message: 'Hash calculation failed',
      data: { error }
    });
    
    return '';
  }
}

/**
 * Verifies data integrity using a hash
 * 
 * @param data Data to verify
 * @param expectedHash Expected hash
 * @returns Whether the data is valid
 */
export function verifyDataIntegrity(data: any, expectedHash: string): boolean {
  const actualHash = hashData(data);
  return actualHash === expectedHash;
}

/**
 * Creates a signed data object with integrity hash
 * 
 * @param data Data to sign
 * @returns Signed data object
 */
export function signData<T>(data: T): { data: T; hash: string } {
  return {
    data,
    hash: hashData(data)
  };
}

// ==============================
// Memory Safety
// ==============================

/**
 * Creates a deep frozen copy of an object to prevent mutations
 * 
 * @param obj Object to freeze
 * @returns Deep frozen object
 */
export function deepFreeze<T>(obj: T): T {
  // Return primitives as is
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  // Freeze properties
  Object.getOwnPropertyNames(obj).forEach(prop => {
    const value = (obj as any)[prop];
    if (value !== null && 
        (typeof value === 'object' || typeof value === 'function') &&
        !Object.isFrozen(value)) {
      deepFreeze(value);
    }
  });
  
  // Freeze the object itself
  return Object.freeze(obj);
}

/**
 * Creates a deep clone of an object to prevent reference sharing
 * 
 * @param obj Object to clone
 * @returns Deep clone of the object
 */
export function deepClone<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (error) {
    logSecurityEvent({
      level: SECURITY_CONSTANTS.LOG_LEVELS.ERROR,
      message: 'Deep clone failed',
      data: { error }
    });
    
    return obj;
  }
}

/**
 * Safely limits the memory usage of large objects
 * 
 * @param obj Object to limit
 * @param maxDepth Maximum depth to traverse
 * @param maxProperties Maximum properties per object
 * @param maxStringLength Maximum string length
 * @returns Memory-safe object
 */
export function limitObjectSize<T>(
  obj: T,
  maxDepth: number = 10,
  maxProperties: number = 100,
  maxStringLength: number = 10000
): T {
  function limit(value: any, depth: number): any {
    // Base case: max depth reached or null/undefined
    if (depth >= maxDepth || value === null || value === undefined) {
      return value;
    }
    
    // Handle primitives
    if (typeof value !== 'object') {
      // Limit string length
      if (typeof value === 'string' && value.length > maxStringLength) {
        return value.substring(0, maxStringLength) + '...';
      }
      return value;
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      return value.slice(0, maxProperties).map(item => limit(item, depth + 1));
    }
    
    // Handle objects
    const result: any = {};
    let count = 0;
    
    for (const key in value) {
      if (Object.prototype.hasOwnProperty.call(value, key)) {
        if (count >= maxProperties) break;
        result[key] = limit(value[key], depth + 1);
        count++;
      }
    }
    
    return result;
  }
  
  return limit(obj, 0);
}

// ==============================
// Audit Logging
// ==============================

/**
 * Logs a security event
 * 
 * @param event Security event to log
 */
export function logSecurityEvent(event: Omit<SecurityEvent, 'timestamp'>): void {
  const fullEvent: SecurityEvent = {
    timestamp: Date.now(),
    ...event
  };
  
  // Sanitize event data to prevent log injection
  if (fullEvent.message) {
    fullEvent.message = sanitizeString(fullEvent.message);
  }
  
  // Limit object size to prevent memory issues
  fullEvent.data = fullEvent.data ? limitObjectSize(fullEvent.data) : undefined;
  
  // Log to console in development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[${fullEvent.level}] ${fullEvent.message}`, fullEvent.data || '');
  }
  
  // In production, this would send to a secure logging service
  // This is a placeholder for actual implementation
  if (process.env.NODE_ENV === 'production') {
    try {
      // Example: send to logging service
      // await fetch('/api/security-log', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(fullEvent)
      // });
    } catch (error) {
      // Fallback to console in case of failure
      console.error('Failed to log security event:', error);
    }
  }
}

// ==============================
// Combined Security Functions
// ==============================

/**
 * Validates and sanitizes personal information
 * 
 * @param personalInfo The personal info object to process
 * @returns Validated and sanitized personal info
 * @throws Error if validation fails
 */
export function processPersonalInfo(personalInfo: PersonalInfo): PersonalInfo {
  // Validate
  const validation = validatePersonalInfo(personalInfo);
  if (!validation.isValid) {
    throw createValidationError(`Invalid personal information: ${validation.errors.join(', ')}`);
  }
  
  // Sanitize
  const sanitized = sanitizePersonalInfo(personalInfo);
  
  // Log processing
  logSecurityEvent({
    level: SECURITY_CONSTANTS.LOG_LEVELS.INFO,
    message: 'Personal information processed',
    data: { canton: sanitized.canton, municipality: sanitized.municipality }
  });
  
  // Return immutable copy
  return deepFreeze(sanitized);
}

/**
 * Validates and sanitizes financial information
 * 
 * @param financialInfo The financial info object to process
 * @returns Validated and sanitized financial info
 * @throws Error if validation fails
 */
export function processFinancialInfo(financialInfo: FinancialInfo): FinancialInfo {
  // Validate
  const validation = validateFinancialInfo(financialInfo);
  if (!validation.isValid) {
    throw createValidationError(`Invalid financial information: ${validation.errors.join(', ')}`);
  }
  
  // Sanitize
  const sanitized = sanitizeFinancialInfo(financialInfo);
  
  // Log processing
  logSecurityEvent({
    level: SECURITY_CONSTANTS.LOG_LEVELS.INFO,
    message: 'Financial information processed',
    data: { incomeRange: getIncomeRange(sanitized.yearlyIncome) }
  });
  
  // Return immutable copy
  return deepFreeze(sanitized);
}

/**
 * Gets a generic income range for logging (to avoid logging exact income)
 * 
 * @param income Income amount
 * @returns Income range description
 */
function getIncomeRange(income: number): string {
  if (income < 50000) return 'below_50k';
  if (income < 100000) return '50k_to_100k';
  if (income < 200000) return '100k_to_200k';
  if (income < 500000) return '200k_to_500k';
  return 'above_500k';
}

/**
 * Security wrapper for tax calculation function
 * 
 * @param fn The function to wrap
 * @returns Wrapped function with security measures
 */
export function secureFunction<T extends (...args: any[]) => any>(fn: T): T {
  return ((...args: Parameters<T>): ReturnType<T> => {
    try {
      // Check rate limit (using function name as key)
      if (!checkRateLimit(`fn:${fn.name}`)) {
        throw createSecurityError(SECURITY_CONSTANTS.ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
      }
      
      // Clone arguments to prevent reference manipulation
      const safeArgs = args.map(arg => deepClone(arg));
      
      // Execute function with safe arguments
      const result = fn(...safeArgs);
      
      // Return deep clone of result to prevent reference manipulation
      return deepClone(result);
    } catch (error) {
      // Log error
      logSecurityEvent({
        level: SECURITY_CONSTANTS.LOG_LEVELS.ERROR,
        message: `Error in secure function ${fn.name}`,
        data: { error }
      });
      
      // Re-throw sanitized error
      throw new Error(sanitizeError(error));
    }
  }) as T;
}
