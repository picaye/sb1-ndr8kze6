/**
 * @file encryption.ts
 * @description Comprehensive security encryption and protection utilities for Swiss tax calculator
 * 
 * This module provides robust security measures for data protection:
 * - Client-side encryption for sensitive data
 * - Secure random generation
 * - Token validation and generation
 * - CSRF protection
 * - Content Security Policy helpers
 * - Secure storage
 * - Password/token hashing
 * - Time-safe comparison
 * - Security headers
 * - Environment validation
 */

// ==============================
// Types and Interfaces
// ==============================

/**
 * Encryption algorithm options
 */
export enum EncryptionAlgorithm {
  AES_GCM = 'AES-GCM',
  AES_CBC = 'AES-CBC',
}

/**
 * Key derivation function options
 */
export enum KeyDerivationFunction {
  PBKDF2 = 'PBKDF2',
  HKDF = 'HKDF',
}

/**
 * Encryption options
 */
export interface EncryptionOptions {
  algorithm?: EncryptionAlgorithm;
  keyDerivation?: KeyDerivationFunction;
  iterations?: number;
  saltLength?: number;
  ivLength?: number;
  tagLength?: number;
}

/**
 * Encrypted data format
 */
export interface EncryptedData {
  ciphertext: string;
  iv: string;
  salt: string;
  algorithm: string;
  keyDerivation: string;
  iterations: number;
  tagLength?: number;
}

/**
 * Token payload interface
 */
export interface TokenPayload {
  [key: string]: any;
  exp?: number;
  iat?: number;
  nbf?: number;
}

/**
 * Security headers configuration
 */
export interface SecurityHeadersConfig {
  enableHSTS?: boolean;
  enableCSP?: boolean;
  enableFrameOptions?: boolean;
  enableXSSProtection?: boolean;
  enableContentTypeOptions?: boolean;
  enableReferrerPolicy?: boolean;
  enablePermissionsPolicy?: boolean;
  reportOnly?: boolean;
  reportUri?: string;
}

/**
 * CSP directive configuration
 */
export interface CSPConfig {
  defaultSrc?: string[];
  scriptSrc?: string[];
  styleSrc?: string[];
  imgSrc?: string[];
  connectSrc?: string[];
  fontSrc?: string[];
  objectSrc?: string[];
  mediaSrc?: string[];
  frameSrc?: string[];
  reportUri?: string;
  reportOnly?: boolean;
  upgradeInsecureRequests?: boolean;
}

// ==============================
// Constants
// ==============================

/**
 * Default encryption options
 */
const DEFAULT_ENCRYPTION_OPTIONS: EncryptionOptions = {
  algorithm: EncryptionAlgorithm.AES_GCM,
  keyDerivation: KeyDerivationFunction.PBKDF2,
  iterations: 100000,
  saltLength: 16,
  ivLength: 12,
  tagLength: 128,
};

/**
 * Default token expiration time (1 hour)
 */
const DEFAULT_TOKEN_EXPIRATION = 60 * 60; // 1 hour in seconds

/**
 * Default CSRF token expiration time (1 hour)
 */
const DEFAULT_CSRF_EXPIRATION = 60 * 60; // 1 hour in seconds

/**
 * Required security environment variables
 */
const REQUIRED_SECURITY_ENV_VARS = [
  'NODE_ENV',
  'ENCRYPTION_SECRET',
  'API_KEY',
];

// ==============================
// Utility Functions
// ==============================

/**
 * Converts string to ArrayBuffer
 * 
 * @param str String to convert
 * @returns ArrayBuffer
 */
function stringToArrayBuffer(str: string): ArrayBuffer {
  const encoder = new TextEncoder();
  return encoder.encode(str).buffer;
}

/**
 * Converts ArrayBuffer to string
 * 
 * @param buffer ArrayBuffer to convert
 * @returns String
 */
function arrayBufferToString(buffer: ArrayBuffer): string {
  const decoder = new TextDecoder();
  return decoder.decode(new Uint8Array(buffer));
}

/**
 * Converts ArrayBuffer to Base64 string
 * 
 * @param buffer ArrayBuffer to convert
 * @returns Base64 string
 */
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Converts Base64 string to ArrayBuffer
 * 
 * @param base64 Base64 string to convert
 * @returns ArrayBuffer
 */
function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const binaryString = atob(base64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

/**
 * Checks if Web Crypto API is available
 * 
 * @returns Whether Web Crypto API is available
 */
function isCryptoAvailable(): boolean {
  return typeof window !== 'undefined' && 
         window.crypto !== undefined && 
         window.crypto.subtle !== undefined;
}

// ==============================
// 1. Client-side Data Encryption
// ==============================

/**
 * Generates a cryptographic key from a password
 * 
 * @param password Password to derive key from
 * @param salt Salt for key derivation
 * @param options Encryption options
 * @returns Promise resolving to CryptoKey
 */
export async function deriveKey(
  password: string, 
  salt: ArrayBuffer,
  options: EncryptionOptions = DEFAULT_ENCRYPTION_OPTIONS
): Promise<CryptoKey> {
  if (!isCryptoAvailable()) {
    throw new Error('Web Crypto API is not available in this environment');
  }
  
  // Import the password as a key
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(password),
    { name: 'PBKDF2' },
    false,
    ['deriveKey']
  );
  
  // Derive a key using PBKDF2
  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: options.iterations || DEFAULT_ENCRYPTION_OPTIONS.iterations!,
      hash: 'SHA-256',
    },
    baseKey,
    {
      name: options.algorithm || DEFAULT_ENCRYPTION_OPTIONS.algorithm!,
      length: 256,
    },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts sensitive data using AES-GCM
 * 
 * @param data Data to encrypt
 * @param password Password for encryption
 * @param options Encryption options
 * @returns Promise resolving to encrypted data
 */
export async function encryptData(
  data: string, 
  password: string, 
  options: EncryptionOptions = DEFAULT_ENCRYPTION_OPTIONS
): Promise<EncryptedData> {
  if (!isCryptoAvailable()) {
    throw new Error('Web Crypto API is not available in this environment');
  }
  
  // Generate a random salt
  const salt = window.crypto.getRandomValues(
    new Uint8Array(options.saltLength || DEFAULT_ENCRYPTION_OPTIONS.saltLength!)
  );
  
  // Generate a random IV
  const iv = window.crypto.getRandomValues(
    new Uint8Array(options.ivLength || DEFAULT_ENCRYPTION_OPTIONS.ivLength!)
  );
  
  // Derive the key from the password
  const key = await deriveKey(password, salt.buffer, options);
  
  // Encrypt the data
  const algorithm = options.algorithm || DEFAULT_ENCRYPTION_OPTIONS.algorithm!;
  const encryptionParams = algorithm === EncryptionAlgorithm.AES_GCM
    ? { name: algorithm, iv, tagLength: options.tagLength || DEFAULT_ENCRYPTION_OPTIONS.tagLength! }
    : { name: algorithm, iv };
    
  const encryptedData = await window.crypto.subtle.encrypt(
    encryptionParams,
    key,
    stringToArrayBuffer(data)
  );
  
  // Return the encrypted data in a structured format
  return {
    ciphertext: arrayBufferToBase64(encryptedData),
    iv: arrayBufferToBase64(iv.buffer),
    salt: arrayBufferToBase64(salt.buffer),
    algorithm,
    keyDerivation: options.keyDerivation || DEFAULT_ENCRYPTION_OPTIONS.keyDerivation!,
    iterations: options.iterations || DEFAULT_ENCRYPTION_OPTIONS.iterations!,
    tagLength: options.tagLength || DEFAULT_ENCRYPTION_OPTIONS.tagLength!,
  };
}

/**
 * Decrypts encrypted data
 * 
 * @param encryptedData Encrypted data to decrypt
 * @param password Password for decryption
 * @returns Promise resolving to decrypted data
 */
export async function decryptData(
  encryptedData: EncryptedData, 
  password: string
): Promise<string> {
  if (!isCryptoAvailable()) {
    throw new Error('Web Crypto API is not available in this environment');
  }
  
  // Convert base64 strings back to ArrayBuffers
  const ciphertext = base64ToArrayBuffer(encryptedData.ciphertext);
  const iv = base64ToArrayBuffer(encryptedData.iv);
  const salt = base64ToArrayBuffer(encryptedData.salt);
  
  // Derive the key from the password
  const key = await deriveKey(
    password, 
    salt, 
    {
      algorithm: encryptedData.algorithm as EncryptionAlgorithm,
      keyDerivation: encryptedData.keyDerivation as KeyDerivationFunction,
      iterations: encryptedData.iterations,
      tagLength: encryptedData.tagLength,
    }
  );
  
  // Decrypt the data
  const algorithm = encryptedData.algorithm as EncryptionAlgorithm;
  const decryptionParams = algorithm === EncryptionAlgorithm.AES_GCM
    ? { name: algorithm, iv, tagLength: encryptedData.tagLength || DEFAULT_ENCRYPTION_OPTIONS.tagLength! }
    : { name: algorithm, iv };
    
  const decryptedData = await window.crypto.subtle.decrypt(
    decryptionParams,
    key,
    ciphertext
  );
  
  // Convert the decrypted data to a string
  return arrayBufferToString(decryptedData);
}

// ==============================
// 2. Secure Random Generation
// ==============================

/**
 * Generates a cryptographically secure random string
 * 
 * @param length Length of the random string
 * @param encoding Encoding of the output ('hex', 'base64', 'alphanumeric')
 * @returns Random string
 */
export function generateSecureRandom(
  length: number = 32, 
  encoding: 'hex' | 'base64' | 'alphanumeric' = 'hex'
): string {
  if (length <= 0) {
    throw new Error('Length must be greater than 0');
  }
  
  // Generate random bytes
  const randomBytes = new Uint8Array(Math.ceil(length * 0.75)); // Account for encoding efficiency
  
  if (isCryptoAvailable()) {
    window.crypto.getRandomValues(randomBytes);
  } else if (typeof require === 'function') {
    try {
      // Node.js fallback
      const crypto = require('crypto');
      const nodeRandomBytes = crypto.randomBytes(randomBytes.length);
      randomBytes.set(new Uint8Array(nodeRandomBytes.buffer));
    } catch (error) {
      throw new Error('Secure random generation is not available in this environment');
    }
  } else {
    throw new Error('Secure random generation is not available in this environment');
  }
  
  // Convert to the requested encoding
  let result = '';
  
  switch (encoding) {
    case 'hex':
      result = Array.from(randomBytes)
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
      break;
      
    case 'base64':
      result = arrayBufferToBase64(randomBytes.buffer);
      break;
      
    case 'alphanumeric':
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      for (let i = 0; i < randomBytes.length; i++) {
        result += chars.charAt(randomBytes[i] % chars.length);
      }
      break;
      
    default:
      throw new Error(`Unsupported encoding: ${encoding}`);
  }
  
  // Ensure exact length
  return result.slice(0, length);
}

/**
 * Generates a cryptographically secure random number within a range
 * 
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Random number within the range
 */
export function generateSecureRandomNumber(min: number, max: number): number {
  if (min >= max) {
    throw new Error('Min must be less than max');
  }
  
  // Generate random bytes
  const range = max - min + 1;
  const byteCount = Math.ceil(Math.log2(range) / 8);
  const randomBytes = new Uint8Array(byteCount);
  
  if (isCryptoAvailable()) {
    window.crypto.getRandomValues(randomBytes);
  } else if (typeof require === 'function') {
    try {
      // Node.js fallback
      const crypto = require('crypto');
      const nodeRandomBytes = crypto.randomBytes(randomBytes.length);
      randomBytes.set(new Uint8Array(nodeRandomBytes.buffer));
    } catch (error) {
      throw new Error('Secure random generation is not available in this environment');
    }
  } else {
    throw new Error('Secure random generation is not available in this environment');
  }
  
  // Convert bytes to a number
  let value = 0;
  for (let i = 0; i < randomBytes.length; i++) {
    value = (value << 8) | randomBytes[i];
  }
  
  // Map to the range
  return min + (value % range);
}

/**
 * Generates a secure UUID v4
 * 
 * @returns UUID v4 string
 */
export function generateUUID(): string {
  if (isCryptoAvailable() && 'randomUUID' in window.crypto) {
    return window.crypto.randomUUID();
  }
  
  // Fallback implementation
  const randomBytes = new Uint8Array(16);
  
  if (isCryptoAvailable()) {
    window.crypto.getRandomValues(randomBytes);
  } else if (typeof require === 'function') {
    try {
      // Node.js fallback
      const crypto = require('crypto');
      const nodeRandomBytes = crypto.randomBytes(16);
      randomBytes.set(new Uint8Array(nodeRandomBytes.buffer));
    } catch (error) {
      throw new Error('Secure random generation is not available in this environment');
    }
  } else {
    throw new Error('Secure random generation is not available in this environment');
  }
  
  // Set version (4) and variant (RFC4122)
  randomBytes[6] = (randomBytes[6] & 0x0f) | 0x40;
  randomBytes[8] = (randomBytes[8] & 0x3f) | 0x80;
  
  // Convert to UUID string format
  let uuid = '';
  for (let i = 0; i < 16; i++) {
    if (i === 4 || i === 6 || i === 8 || i === 10) {
      uuid += '-';
    }
    uuid += randomBytes[i].toString(16).padStart(2, '0');
  }
  
  return uuid;
}

// ==============================
// 3. Token Validation and Generation
// ==============================

/**
 * Generates a secure token with optional payload
 * 
 * @param payload Token payload
 * @param secret Secret for token signing
 * @param expiresIn Expiration time in seconds
 * @returns Secure token string
 */
export async function generateToken(
  payload: TokenPayload = {},
  secret: string,
  expiresIn: number = DEFAULT_TOKEN_EXPIRATION
): Promise<string> {
  if (!isCryptoAvailable()) {
    throw new Error('Web Crypto API is not available in this environment');
  }
  
  // Add standard claims
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: TokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  };
  
  // Encode header and payload
  const header = {
    alg: 'HS256',
    typ: 'JWT',
  };
  
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(fullPayload));
  
  // Create signature
  const encoder = new TextEncoder();
  const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);
  const keyData = encoder.encode(secret);
  
  const key = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await window.crypto.subtle.sign(
    'HMAC',
    key,
    data
  );
  
  const encodedSignature = arrayBufferToBase64(signature)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
  
  // Return the token
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Validates a token
 * 
 * @param token Token to validate
 * @param secret Secret for token verification
 * @returns Decoded token payload if valid
 * @throws Error if token is invalid
 */
export async function validateToken(
  token: string,
  secret: string
): Promise<TokenPayload> {
  if (!isCryptoAvailable()) {
    throw new Error('Web Crypto API is not available in this environment');
  }
  
  // Split the token
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('Invalid token format');
  }
  
  const [encodedHeader, encodedPayload, encodedSignature] = parts;
  
  // Verify signature
  const encoder = new TextEncoder();
  const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);
  const keyData = encoder.encode(secret);
  
  const key = await window.crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  );
  
  // Convert the signature from base64url to ArrayBuffer
  const signature = base64ToArrayBuffer(
    encodedSignature
      .replace(/-/g, '+')
      .replace(/_/g, '/')
      .padEnd(encodedSignature.length + (4 - encodedSignature.length % 4) % 4, '=')
  );
  
  const isValid = await window.crypto.subtle.verify(
    'HMAC',
    key,
    signature,
    data
  );
  
  if (!isValid) {
    throw new Error('Invalid token signature');
  }
  
  // Decode payload
  try {
    const payload: TokenPayload = JSON.parse(atob(encodedPayload));
    
    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      throw new Error('Token has expired');
    }
    
    // Check not-before time
    if (payload.nbf && payload.nbf > now) {
      throw new Error('Token not yet valid');
    }
    
    return payload;
  } catch (error) {
    throw new Error('Invalid token payload');
  }
}

// ==============================
// 4. CSRF Protection
// ==============================

/**
 * Generates a CSRF token
 * 
 * @param userId User identifier for binding the token
 * @param secret Secret for token signing
 * @param expiresIn Expiration time in seconds
 * @returns CSRF token
 */
export async function generateCSRFToken(
  userId: string,
  secret: string,
  expiresIn: number = DEFAULT_CSRF_EXPIRATION
): Promise<string> {
  // Generate a random token
  const randomPart = generateSecureRandom(32);
  
  // Create a payload with user binding and expiration
  const payload = {
    userId,
    random: randomPart,
  };
  
  // Generate a signed token
  return generateToken(payload, secret, expiresIn);
}

/**
 * Validates a CSRF token
 * 
 * @param token CSRF token to validate
 * @param userId User identifier for verification
 * @param secret Secret for token verification
 * @returns Whether the token is valid
 */
export async function validateCSRFToken(
  token: string,
  userId: string,
  secret: string
): Promise<boolean> {
  try {
    // Validate the token signature and expiration
    const payload = await validateToken(token, secret);
    
    // Verify the user binding
    return payload.userId === userId;
  } catch (error) {
    return false;
  }
}

/**
 * Sets a CSRF cookie
 * 
 * @param token CSRF token
 * @param expiresIn Expiration time in seconds
 */
export function setCSRFCookie(
  token: string,
  expiresIn: number = DEFAULT_CSRF_EXPIRATION
): void {
  if (typeof document === 'undefined') {
    return;
  }
  
  const expires = new Date(Date.now() + expiresIn * 1000).toUTCString();
  document.cookie = `XSRF-TOKEN=${token}; expires=${expires}; path=/; SameSite=Strict; Secure`;
}

/**
 * Gets the CSRF token from cookies
 * 
 * @returns CSRF token or null if not found
 */
export function getCSRFCookie(): string | null {
  if (typeof document === 'undefined') {
    return null;
  }
  
  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === 'XSRF-TOKEN') {
      return value;
    }
  }
  
  return null;
}

// ==============================
// 5. Content Security Policy Helpers
// ==============================

/**
 * Generates a secure nonce for CSP
 * 
 * @returns CSP nonce
 */
export function generateCSPNonce(): string {
  return generateSecureRandom(16, 'base64');
}

/**
 * Builds a Content Security Policy header value
 * 
 * @param config CSP configuration
 * @returns CSP header value
 */
export function buildCSP(config: CSPConfig): string {
  const directives: string[] = [];
  
  // Add directives
  if (config.defaultSrc) {
    directives.push(`default-src ${config.defaultSrc.join(' ')}`);
  } else {
    directives.push("default-src 'self'");
  }
  
  if (config.scriptSrc) {
    directives.push(`script-src ${config.scriptSrc.join(' ')}`);
  }
  
  if (config.styleSrc) {
    directives.push(`style-src ${config.styleSrc.join(' ')}`);
  }
  
  if (config.imgSrc) {
    directives.push(`img-src ${config.imgSrc.join(' ')}`);
  }
  
  if (config.connectSrc) {
    directives.push(`connect-src ${config.connectSrc.join(' ')}`);
  }
  
  if (config.fontSrc) {
    directives.push(`font-src ${config.fontSrc.join(' ')}`);
  }
  
  if (config.objectSrc) {
    directives.push(`object-src ${config.objectSrc.join(' ')}`);
  } else {
    directives.push("object-src 'none'");
  }
  
  if (config.mediaSrc) {
    directives.push(`media-src ${config.mediaSrc.join(' ')}`);
  }
  
  if (config.frameSrc) {
    directives.push(`frame-src ${config.frameSrc.join(' ')}`);
  }
  
  if (config.reportUri) {
    directives.push(`report-uri ${config.reportUri}`);
  }
  
  if (config.upgradeInsecureRequests) {
    directives.push('upgrade-insecure-requests');
  }
  
  return directives.join('; ');
}

/**
 * Adds a nonce to a CSP directive
 * 
 * @param directive CSP directive
 * @param nonce Nonce to add
 * @returns Updated CSP directive
 */
export function addNonceToCSP(directive: string, nonce: string): string {
  return directive.includes("'nonce-")
    ? directive
    : `${directive} 'nonce-${nonce}'`;
}

// ==============================
// 6. Secure Storage Utilities
// ==============================

/**
 * Securely stores data in localStorage with encryption
 * 
 * @param key Storage key
 * @param data Data to store
 * @param password Encryption password
 * @returns Promise resolving when data is stored
 */
export async function secureLocalStorage(
  key: string,
  data: any,
  password: string
): Promise<void> {
  if (typeof localStorage === 'undefined') {
    throw new Error('localStorage is not available in this environment');
  }
  
  // Stringify the data
  const jsonData = JSON.stringify(data);
  
  // Encrypt the data
  const encryptedData = await encryptData(jsonData, password);
  
  // Store the encrypted data
  localStorage.setItem(key, JSON.stringify(encryptedData));
}

/**
 * Retrieves securely stored data from localStorage
 * 
 * @param key Storage key
 * @param password Decryption password
 * @returns Promise resolving to the stored data
 */
export async function getSecureLocalStorage<T>(
  key: string,
  password: string
): Promise<T | null> {
  if (typeof localStorage === 'undefined') {
    throw new Error('localStorage is not available in this environment');
  }
  
  // Get the encrypted data
  const encryptedJson = localStorage.getItem(key);
  if (!encryptedJson) {
    return null;
  }
  
  try {
    // Parse the encrypted data
    const encryptedData: EncryptedData = JSON.parse(encryptedJson);
    
    // Decrypt the data
    const jsonData = await decryptData(encryptedData, password);
    
    // Parse the JSON data
    return JSON.parse(jsonData);
  } catch (error) {
    // If decryption fails, remove the corrupted data
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Memory-only secure storage (for sensitive data that should not be persisted)
 */
export class MemoryStorage {
  private static store = new Map<string, any>();
  
  /**
   * Sets a value in memory storage
   * 
   * @param key Storage key
   * @param value Value to store
   */
  static set(key: string, value: any): void {
    this.store.set(key, value);
  }
  
  /**
   * Gets a value from memory storage
   * 
   * @param key Storage key
   * @returns Stored value or null if not found
   */
  static get<T>(key: string): T | null {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  
  /**
   * Removes a value from memory storage
   * 
   * @param key Storage key
   */
  static remove(key: string): void {
    this.store.delete(key);
  }
  
  /**
   * Clears all values from memory storage
   */
  static clear(): void {
    this.store.clear();
  }
}

// ==============================
// 7. Password/Token Hashing Functions
// ==============================

/**
 * Hashes a password using PBKDF2
 * 
 * @param password Password to hash
 * @param salt Salt for hashing (generated if not provided)
 * @param iterations Number of iterations
 * @returns Promise resolving to hashed password
 */
export async function hashPassword(
  password: string,
  salt?: string,
  iterations: number = 100000
): Promise<{ hash: string; salt: string }> {
  if (!isCryptoAvailable()) {
    throw new Error('Web Crypto API is not available in this environment');
  }
  
  // Generate or use provided salt
  const saltBuffer = salt
    ? base64ToArrayBuffer(salt)
    : window.crypto.getRandomValues(new Uint8Array(16)).buffer;
  
  // Import the password as a key
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    stringToArrayBuffer(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );
  
  // Derive bits using PBKDF2
  const derivedBits = await window.crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations,
      hash: 'SHA-256',
    },
    baseKey,
    256
  );
  
  // Convert to base64
  const hash = arrayBufferToBase64(derivedBits);
  const saltBase64 = salt || arrayBufferToBase64(saltBuffer);
  
  return { hash, salt: saltBase64 };
}

/**
 * Verifies a password against a hash
 * 
 * @param password Password to verify
 * @param hash Hash to verify against
 * @param salt Salt used for hashing
 * @param iterations Number of iterations used for hashing
 * @returns Promise resolving to whether the password is valid
 */
export async function verifyPassword(
  password: string,
  hash: string,
  salt: string,
  iterations: number = 100000
): Promise<boolean> {
  try {
    // Hash the password with the same salt and iterations
    const result = await hashPassword(password, salt, iterations);
    
    // Compare the hashes using a time-safe comparison
    return timeSafeEqual(result.hash, hash);
  } catch (error) {
    return false;
  }
}

// ==============================
// 8. Time-Safe Comparison Functions
// ==============================

/**
 * Compares two strings in constant time to prevent timing attacks
 * 
 * @param a First string
 * @param b Second string
 * @returns Whether the strings are equal
 */
export function timeSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) {
    // Perform a comparison anyway to prevent timing attacks
    let result = 0;
    const longest = a.length > b.length ? a : b;
    const shortest = a.length > b.length ? b : a;
    
    for (let i = 0; i < longest.length; i++) {
      result |= (i < shortest.length ? shortest.charCodeAt(i) : 0) ^ longest.charCodeAt(i);
    }
    
    return false;
  }
  
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  
  return result === 0;
}

/**
 * Compares two ArrayBuffers in constant time
 * 
 * @param a First ArrayBuffer
 * @param b Second ArrayBuffer
 * @returns Whether the ArrayBuffers are equal
 */
export function timeSafeEqualArrayBuffer(a: ArrayBuffer, b: ArrayBuffer): boolean {
  if (a.byteLength !== b.byteLength) {
    // Perform a comparison anyway to prevent timing attacks
    const longest = a.byteLength > b.byteLength ? new Uint8Array(a) : new Uint8Array(b);
    const shortest = a.byteLength > b.byteLength ? new Uint8Array(b) : new Uint8Array(a);
    
    let result = 0;
    for (let i = 0; i < longest.length; i++) {
      result |= (i < shortest.length ? shortest[i] : 0) ^ longest[i];
    }
    
    return false;
  }
  
  const aView = new Uint8Array(a);
  const bView = new Uint8Array(b);
  
  let result = 0;
  for (let i = 0; i < aView.length; i++) {
    result |= aView[i] ^ bView[i];
  }
  
  return result === 0;
}

// ==============================
// 9. Security Headers Utilities
// ==============================

/**
 * Generates recommended security headers
 * 
 * @param config Security headers configuration
 * @returns Object with security headers
 */
export function generateSecurityHeaders(config: SecurityHeadersConfig = {}): Record<string, string> {
  const headers: Record<string, string> = {};
  
  // HTTP Strict Transport Security
  if (config.enableHSTS !== false) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload';
  }
  
  // Content Security Policy
  if (config.enableCSP !== false) {
    const cspHeader = config.reportOnly ? 'Content-Security-Policy-Report-Only' : 'Content-Security-Policy';
    headers[cspHeader] = buildCSP({
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      reportUri: config.reportUri,
    });
  }
  
  // X-Frame-Options
  if (config.enableFrameOptions !== false) {
    headers['X-Frame-Options'] = 'DENY';
  }
  
  // X-XSS-Protection
  if (config.enableXSSProtection !== false) {
    headers['X-XSS-Protection'] = '1; mode=block';
  }
  
  // X-Content-Type-Options
  if (config.enableContentTypeOptions !== false) {
    headers['X-Content-Type-Options'] = 'nosniff';
  }
  
  // Referrer-Policy
  if (config.enableReferrerPolicy !== false) {
    headers['Referrer-Policy'] = 'strict-origin-when-cross-origin';
  }
  
  // Permissions-Policy
  if (config.enablePermissionsPolicy !== false) {
    headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=(), interest-cohort=()';
  }
  
  return headers;
}

/**
 * Applies security headers to a response (for server environments)
 * 
 * @param response Response object with setHeader method
 * @param config Security headers configuration
 */
export function applySecurityHeaders(
  response: { setHeader: (name: string, value: string) => void },
  config: SecurityHeadersConfig = {}
): void {
  const headers = generateSecurityHeaders(config);
  
  for (const [name, value] of Object.entries(headers)) {
    response.setHeader(name, value);
  }
}

// ==============================
// 10. Environment Variable Validation
// ==============================

/**
 * Validates required security environment variables
 * 
 * @param env Environment variables object
 * @param required Required variable names
 * @returns Validation result
 */
export function validateSecurityEnv(
  env: Record<string, string | undefined>,
  required: string[] = REQUIRED_SECURITY_ENV_VARS
): { isValid: boolean; missing: string[] } {
  const missing: string[] = [];
  
  for (const name of required) {
    if (!env[name]) {
      missing.push(name);
    }
  }
  
  return {
    isValid: missing.length === 0,
    missing,
  };
}

/**
 * Gets a security environment variable with fallback
 * 
 * @param env Environment variables object
 * @param name Variable name
 * @param fallback Fallback value
 * @param required Whether the variable is required
 * @returns Environment variable value
 * @throws Error if required variable is missing
 */
export function getSecurityEnv(
  env: Record<string, string | undefined>,
  name: string,
  fallback?: string,
  required: boolean = true
): string {
  const value = env[name];
  
  if (value === undefined) {
    if (required && fallback === undefined) {
      throw new Error(`Required security environment variable ${name} is missing`);
    }
    return fallback as string;
  }
  
  return value;
}

/**
 * Validates that production environment has secure settings
 * 
 * @param env Environment variables object
 * @returns Validation result
 */
export function validateProductionSecurity(
  env: Record<string, string | undefined>
): { isValid: boolean; issues: string[] } {
  if (env.NODE_ENV !== 'production') {
    return { isValid: true, issues: [] };
  }
  
  const issues: string[] = [];
  
  // Check for secure encryption secret
  if (!env.ENCRYPTION_SECRET || env.ENCRYPTION_SECRET.length < 32) {
    issues.push('ENCRYPTION_SECRET should be at least 32 characters in production');
  }
  
  // Check for secure API key
  if (!env.API_KEY || env.API_KEY.length < 32) {
    issues.push('API_KEY should be at least 32 characters in production');
  }
  
  // Check for secure JWT secret
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) {
    issues.push('JWT_SECRET should be at least 32 characters in production');
  }
  
  // Check for secure cookie settings
  if (env.COOKIE_SECURE !== 'true') {
    issues.push('COOKIE_SECURE should be true in production');
  }
  
  return {
    isValid: issues.length === 0,
    issues,
  };
}

// ==============================
// Additional Utilities
// ==============================

/**
 * Sanitizes sensitive data from objects (for logging)
 * 
 * @param data Data to sanitize
 * @param sensitiveKeys Keys to sanitize
 * @returns Sanitized data
 */
export function sanitizeSensitiveData<T extends object>(
  data: T,
  sensitiveKeys: string[] = ['password', 'token', 'secret', 'key', 'apiKey', 'credit_card']
): T {
  if (!data || typeof data !== 'object') {
    return data;
  }
  
  const result = { ...data };
  
  for (const key of Object.keys(result)) {
    const lowerKey = key.toLowerCase();
    
    if (sensitiveKeys.some(k => lowerKey.includes(k.toLowerCase()))) {
      (result as any)[key] = '[REDACTED]';
    } else if (typeof (result as any)[key] === 'object' && (result as any)[key] !== null) {
      (result as any)[key] = sanitizeSensitiveData((result as any)[key], sensitiveKeys);
    }
  }
  
  return result;
}

/**
 * Checks if the current connection is secure (HTTPS)
 * 
 * @returns Whether the connection is secure
 */
export function isSecureConnection(): boolean {
  if (typeof window === 'undefined') {
    return true; // Assume secure in non-browser environments
  }
  
  return window.location.protocol === 'https:';
}

/**
 * Warns if running in an insecure context
 */
export function warnIfInsecure(): void {
  if (!isSecureConnection()) {
    console.warn(
      'Security Warning: This application is running in an insecure context (HTTP). ' +
      'Security features may not work properly. Use HTTPS in production.'
    );
  }
}
