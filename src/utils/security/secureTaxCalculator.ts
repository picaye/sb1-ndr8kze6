/**
 * @file secureTaxCalculator.ts
 * @description Comprehensive security wrapper for Swiss tax calculator
 * 
 * This module provides a hardened security layer around the tax calculator:
 * - Input validation and sanitization
 * - Rate limiting protection
 * - Audit logging of all calculations
 * - Error sanitization
 * - Data integrity checks
 * - Memory safety protections
 * - Anti-tampering measures
 * - Session validation
 * - CSRF protection
 * - Secure data handling
 */

import { calculateTaxes } from '../tax/calculators/taxCalculator';
import { PersonalInfo, FinancialInfo } from '../../types/TaxInfo';
import { TaxBreakdown } from '../tax/types';
import { 
  validatePersonalInfo, 
  validateFinancialInfo,
  sanitizePersonalInfo,
  sanitizeFinancialInfo,
  checkRateLimit,
  createSecurityError,
  createValidationError,
  sanitizeError,
  logSecurityEvent,
  deepClone,
  deepFreeze,
  hashData,
  verifyDataIntegrity,
  signData,
  limitObjectSize,
  SECURITY_CONSTANTS
} from './validation';
import {
  encryptData,
  decryptData,
  generateSecureRandom,
  generateUUID,
  validateCSRFToken,
  timeSafeEqual,
  MemoryStorage
} from './encryption';

// ==============================
// Types and Interfaces
// ==============================

/**
 * Security context for tax calculations
 */
export interface SecurityContext {
  userId?: string;
  sessionId?: string;
  ipAddress?: string;
  csrfToken?: string;
  encryptionKey?: string;
  requestId?: string;
}

/**
 * Secure tax calculation options
 */
export interface SecureTaxCalculatorOptions {
  enableRateLimiting?: boolean;
  enableAuditLogging?: boolean;
  enableEncryption?: boolean;
  enableCSRFProtection?: boolean;
  enableSessionValidation?: boolean;
  maxRequestsPerMinute?: number;
  encryptResults?: boolean;
}

/**
 * Secure tax calculation result
 */
export interface SecureTaxCalculationResult {
  success: boolean;
  data?: TaxBreakdown;
  encryptedData?: string;
  error?: string;
  requestId: string;
  integrity: {
    hash: string;
    timestamp: number;
  };
}

/**
 * Session validation result
 */
interface SessionValidationResult {
  valid: boolean;
  error?: string;
}

// ==============================
// Constants
// ==============================

/**
 * Default security options
 */
const DEFAULT_SECURITY_OPTIONS: SecureTaxCalculatorOptions = {
  enableRateLimiting: true,
  enableAuditLogging: true,
  enableEncryption: false,
  enableCSRFProtection: true,
  enableSessionValidation: true,
  maxRequestsPerMinute: 60,
  encryptResults: false,
};

/**
 * Security event types
 */
enum SecurityEventType {
  CALCULATION_ATTEMPT = 'CALCULATION_ATTEMPT',
  CALCULATION_SUCCESS = 'CALCULATION_SUCCESS',
  CALCULATION_FAILURE = 'CALCULATION_FAILURE',
  VALIDATION_FAILURE = 'VALIDATION_FAILURE',
  RATE_LIMIT_EXCEEDED = 'RATE_LIMIT_EXCEEDED',
  CSRF_FAILURE = 'CSRF_FAILURE',
  SESSION_INVALID = 'SESSION_INVALID',
  TAMPERING_DETECTED = 'TAMPERING_DETECTED',
}

// ==============================
// Secure Tax Calculator
// ==============================

/**
 * Secure tax calculator wrapper
 * 
 * @param personalInfo Personal information for tax calculation
 * @param financialInfo Financial information for tax calculation
 * @param taxYear Tax year to calculate for
 * @param securityContext Security context for the calculation
 * @param options Security options
 * @returns Promise resolving to secure tax calculation result
 */
export async function secureTaxCalculator(
  personalInfo: PersonalInfo,
  financialInfo: FinancialInfo,
  taxYear?: number,
  securityContext: SecurityContext = {},
  options: SecureTaxCalculatorOptions = DEFAULT_SECURITY_OPTIONS
): Promise<SecureTaxCalculationResult> {
  // Generate a unique request ID for tracking and correlation
  const requestId = securityContext.requestId || generateUUID();
  
  try {
    // 1. Apply rate limiting if enabled
    if (options.enableRateLimiting !== false) {
      const rateLimitKey = securityContext.userId || securityContext.ipAddress || 'anonymous';
      const maxRequests = options.maxRequestsPerMinute || DEFAULT_SECURITY_OPTIONS.maxRequestsPerMinute!;
      
      if (!checkRateLimit(`tax-calc:${rateLimitKey}`, maxRequests)) {
        // Log rate limit exceeded
        if (options.enableAuditLogging !== false) {
          logSecurityEvent({
            level: SECURITY_CONSTANTS.LOG_LEVELS.SECURITY,
            message: `Rate limit exceeded for tax calculation`,
            data: {
              userId: securityContext.userId,
              ipAddress: securityContext.ipAddress,
              requestId,
              eventType: SecurityEventType.RATE_LIMIT_EXCEEDED,
            },
          });
        }
        
        throw createSecurityError(SECURITY_CONSTANTS.ERROR_MESSAGES.RATE_LIMIT_EXCEEDED);
      }
    }
    
    // 2. Validate CSRF token if enabled
    if (options.enableCSRFProtection !== false && securityContext.csrfToken) {
      const csrfValid = await validateCSRFToken(
        securityContext.csrfToken,
        securityContext.userId || 'anonymous',
        process.env.CSRF_SECRET || 'default-csrf-secret'
      );
      
      if (!csrfValid) {
        // Log CSRF failure
        if (options.enableAuditLogging !== false) {
          logSecurityEvent({
            level: SECURITY_CONSTANTS.LOG_LEVELS.SECURITY,
            message: `CSRF validation failed for tax calculation`,
            data: {
              userId: securityContext.userId,
              ipAddress: securityContext.ipAddress,
              requestId,
              eventType: SecurityEventType.CSRF_FAILURE,
            },
          });
        }
        
        throw createSecurityError('Invalid CSRF token');
      }
    }
    
    // 3. Validate session if enabled
    if (options.enableSessionValidation !== false && securityContext.sessionId) {
      const sessionValidation = validateSession(securityContext.sessionId, securityContext.userId);
      
      if (!sessionValidation.valid) {
        // Log session validation failure
        if (options.enableAuditLogging !== false) {
          logSecurityEvent({
            level: SECURITY_CONSTANTS.LOG_LEVELS.SECURITY,
            message: `Session validation failed for tax calculation: ${sessionValidation.error}`,
            data: {
              userId: securityContext.userId,
              ipAddress: securityContext.ipAddress,
              requestId,
              eventType: SecurityEventType.SESSION_INVALID,
            },
          });
        }
        
        throw createSecurityError(sessionValidation.error || 'Invalid session');
      }
    }
    
    // 4. Log calculation attempt
    if (options.enableAuditLogging !== false) {
      // Log with minimal sensitive data
      logSecurityEvent({
        level: SECURITY_CONSTANTS.LOG_LEVELS.INFO,
        message: `Tax calculation attempt`,
        data: {
          userId: securityContext.userId,
          ipAddress: securityContext.ipAddress,
          requestId,
          taxYear,
          canton: personalInfo?.canton,
          eventType: SecurityEventType.CALCULATION_ATTEMPT,
        },
      });
    }
    
    // 5. Validate inputs
    const personalInfoValidation = validatePersonalInfo(personalInfo);
    if (!personalInfoValidation.isValid) {
      // Log validation failure
      if (options.enableAuditLogging !== false) {
        logSecurityEvent({
          level: SECURITY_CONSTANTS.LOG_LEVELS.WARN,
          message: `Personal info validation failed for tax calculation`,
          data: {
            userId: securityContext.userId,
            ipAddress: securityContext.ipAddress,
            requestId,
            errors: personalInfoValidation.errors,
            eventType: SecurityEventType.VALIDATION_FAILURE,
          },
        });
      }
      
      throw createValidationError(`Invalid personal information: ${personalInfoValidation.errors.join(', ')}`);
    }
    
    const financialInfoValidation = validateFinancialInfo(financialInfo);
    if (!financialInfoValidation.isValid) {
      // Log validation failure
      if (options.enableAuditLogging !== false) {
        logSecurityEvent({
          level: SECURITY_CONSTANTS.LOG_LEVELS.WARN,
          message: `Financial info validation failed for tax calculation`,
          data: {
            userId: securityContext.userId,
            ipAddress: securityContext.ipAddress,
            requestId,
            errors: financialInfoValidation.errors,
            eventType: SecurityEventType.VALIDATION_FAILURE,
          },
        });
      }
      
      throw createValidationError(`Invalid financial information: ${financialInfoValidation.errors.join(', ')}`);
    }
    
    // 6. Sanitize inputs
    const sanitizedPersonalInfo = sanitizePersonalInfo(personalInfo);
    const sanitizedFinancialInfo = sanitizeFinancialInfo(financialInfo);
    
    // 7. Clone inputs for memory safety
    const safePersonalInfo = deepClone(sanitizedPersonalInfo);
    const safeFinancialInfo = deepClone(sanitizedFinancialInfo);
    
    // 8. Freeze objects to prevent tampering during calculation
    const frozenPersonalInfo = deepFreeze(safePersonalInfo);
    const frozenFinancialInfo = deepFreeze(safeFinancialInfo);
    
    // 9. Perform tax calculation
    const taxResult = calculateTaxes(frozenPersonalInfo, frozenFinancialInfo, taxYear);
    
    // 10. Clone result for memory safety
    const safeTaxResult = deepClone(taxResult);
    
    // 11. Limit object size to prevent DoS
    const limitedTaxResult = limitObjectSize(safeTaxResult);
    
    // 12. Generate integrity hash
    const timestamp = Date.now();
    const resultHash = hashData({
      result: limitedTaxResult,
      timestamp,
      requestId,
    });
    
    // 13. Log successful calculation
    if (options.enableAuditLogging !== false) {
      logSecurityEvent({
        level: SECURITY_CONSTANTS.LOG_LEVELS.INFO,
        message: `Tax calculation successful`,
        data: {
          userId: securityContext.userId,
          ipAddress: securityContext.ipAddress,
          requestId,
          taxYear: limitedTaxResult.taxYear,
          canton: frozenPersonalInfo.canton,
          municipality: frozenPersonalInfo.municipality,
          effectiveRate: limitedTaxResult.effectiveRate,
          totalTax: limitedTaxResult.total,
          eventType: SecurityEventType.CALCULATION_SUCCESS,
        },
      });
    }
    
    // 14. Prepare result
    const result: SecureTaxCalculationResult = {
      success: true,
      requestId,
      integrity: {
        hash: resultHash,
        timestamp,
      },
    };
    
    // 15. Encrypt result if requested
    if (options.encryptResults && securityContext.encryptionKey) {
      const encryptedData = await encryptData(
        JSON.stringify(limitedTaxResult),
        securityContext.encryptionKey
      );
      
      result.encryptedData = JSON.stringify(encryptedData);
    } else {
      result.data = limitedTaxResult;
    }
    
    return result;
  } catch (error) {
    // Log calculation failure
    if (options.enableAuditLogging !== false) {
      logSecurityEvent({
        level: SECURITY_CONSTANTS.LOG_LEVELS.ERROR,
        message: `Tax calculation failed: ${error instanceof Error ? error.message : String(error)}`,
        data: {
          userId: securityContext.userId,
          ipAddress: securityContext.ipAddress,
          requestId,
          eventType: SecurityEventType.CALCULATION_FAILURE,
          errorType: error instanceof Error ? error.constructor.name : typeof error,
        },
      });
    }
    
    // Sanitize error message
    const sanitizedError = sanitizeError(error);
    
    // Return error result
    return {
      success: false,
      error: sanitizedError,
      requestId,
      integrity: {
        hash: hashData({ error: sanitizedError, requestId, timestamp: Date.now() }),
        timestamp: Date.now(),
      },
    };
  }
}

// ==============================
// Utility Functions
// ==============================

/**
 * Validates a session
 * 
 * @param sessionId Session ID to validate
 * @param userId User ID to validate against
 * @returns Session validation result
 */
function validateSession(sessionId: string, userId?: string): SessionValidationResult {
  // This is a placeholder for actual session validation logic
  // In a real application, this would check against a session store
  
  // Example implementation:
  try {
    // Check if session exists
    const sessionData = MemoryStorage.get<{ userId: string; expires: number }>(`session:${sessionId}`);
    
    if (!sessionData) {
      return { valid: false, error: 'Session not found' };
    }
    
    // Check if session has expired
    if (sessionData.expires < Date.now()) {
      return { valid: false, error: 'Session expired' };
    }
    
    // Check if session belongs to the user
    if (userId && sessionData.userId !== userId) {
      return { valid: false, error: 'Session user mismatch' };
    }
    
    return { valid: true };
  } catch (error) {
    return { valid: false, error: 'Session validation error' };
  }
}

/**
 * Verifies the integrity of a tax calculation result
 * 
 * @param result Tax calculation result to verify
 * @returns Whether the result has valid integrity
 */
export function verifyTaxCalculationIntegrity(result: SecureTaxCalculationResult): boolean {
  if (!result.integrity || !result.integrity.hash || !result.integrity.timestamp) {
    return false;
  }
  
  const expectedHash = hashData({
    result: result.data,
    timestamp: result.integrity.timestamp,
    requestId: result.requestId,
  });
  
  return timeSafeEqual(result.integrity.hash, expectedHash);
}

/**
 * Decrypts an encrypted tax calculation result
 * 
 * @param result Encrypted tax calculation result
 * @param encryptionKey Key for decryption
 * @returns Decrypted tax calculation data
 */
export async function decryptTaxCalculationResult(
  result: SecureTaxCalculationResult,
  encryptionKey: string
): Promise<TaxBreakdown> {
  if (!result.encryptedData) {
    throw new Error('No encrypted data in result');
  }
  
  try {
    const encryptedData = JSON.parse(result.encryptedData);
    const decryptedJson = await decryptData(encryptedData, encryptionKey);
    return JSON.parse(decryptedJson);
  } catch (error) {
    throw new Error(`Failed to decrypt tax calculation result: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * Creates a security context for tax calculations
 * 
 * @param userId User ID
 * @param sessionId Session ID
 * @param ipAddress IP address
 * @returns Security context
 */
export function createSecurityContext(
  userId?: string,
  sessionId?: string,
  ipAddress?: string
): SecurityContext {
  return {
    userId,
    sessionId,
    ipAddress,
    requestId: generateUUID(),
    csrfToken: typeof document !== 'undefined' ? document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || undefined : undefined,
    encryptionKey: generateSecureRandom(32),
  };
}

/**
 * Detects potential tampering with tax data
 * 
 * @param personalInfo Personal information to check
 * @param financialInfo Financial information to check
 * @param previousHash Previous hash of the data (if available)
 * @returns Whether tampering was detected
 */
export function detectTampering(
  personalInfo: PersonalInfo,
  financialInfo: FinancialInfo,
  previousHash?: string
): boolean {
  // Calculate current hash
  const currentHash = hashData({ personalInfo, financialInfo });
  
  // If no previous hash, store current hash and return false
  if (!previousHash) {
    MemoryStorage.set(`data-hash:${personalInfo.canton}:${personalInfo.municipality}`, currentHash);
    return false;
  }
  
  // Compare hashes
  const tampering = !timeSafeEqual(currentHash, previousHash);
  
  if (tampering) {
    // Log tampering detection
    logSecurityEvent({
      level: SECURITY_CONSTANTS.LOG_LEVELS.SECURITY,
      message: `Potential tampering detected with tax data`,
      data: {
        canton: personalInfo.canton,
        municipality: personalInfo.municipality,
        eventType: SecurityEventType.TAMPERING_DETECTED,
      },
    });
  }
  
  return tampering;
}

/**
 * Hardened tax calculator for direct use
 * 
 * This is a simplified version of the secure tax calculator for easy drop-in replacement
 * 
 * @param personalInfo Personal information for tax calculation
 * @param financialInfo Financial information for tax calculation
 * @param taxYear Tax year to calculate for
 * @returns Tax calculation result
 * @throws Error if calculation fails
 */
export function hardenedTaxCalculator(
  personalInfo: PersonalInfo,
  financialInfo: FinancialInfo,
  taxYear?: number
): TaxBreakdown {
  try {
    // Validate inputs
    const personalInfoValidation = validatePersonalInfo(personalInfo);
    if (!personalInfoValidation.isValid) {
      throw createValidationError(`Invalid personal information: ${personalInfoValidation.errors.join(', ')}`);
    }
    
    const financialInfoValidation = validateFinancialInfo(financialInfo);
    if (!financialInfoValidation.isValid) {
      throw createValidationError(`Invalid financial information: ${financialInfoValidation.errors.join(', ')}`);
    }
    
    // Sanitize inputs
    const sanitizedPersonalInfo = sanitizePersonalInfo(personalInfo);
    const sanitizedFinancialInfo = sanitizeFinancialInfo(financialInfo);
    
    // Calculate taxes
    return calculateTaxes(sanitizedPersonalInfo, sanitizedFinancialInfo, taxYear);
  } catch (error) {
    // Log error
    logSecurityEvent({
      level: SECURITY_CONSTANTS.LOG_LEVELS.ERROR,
      message: `Hardened tax calculator failed: ${error instanceof Error ? error.message : String(error)}`,
      data: {
        canton: personalInfo?.canton,
        errorType: error instanceof Error ? error.constructor.name : typeof error,
      },
    });
    
    // Re-throw with sanitized message
    throw new Error(sanitizeError(error));
  }
}
