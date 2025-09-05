import { z } from 'zod';

// Phone validation regex - accepts three formats after cleaning
const PHONE_REGEX = /^(?:09\d{9}|\+989\d{9}|00989\d{9})$/;

// Zod schema for phone validation
export const PhoneSchema = z.string()
  .min(1, 'شماره موبایل الزامی است')
  .refine((phone) => {
    const cleaned = cleanPhoneNumber(phone);
    return PHONE_REGEX.test(cleaned);
  }, 'فرمت شماره موبایل صحیح نیست');

/**
 * Cleans phone number by removing spaces, dashes, and other non-digit characters
 * except for the leading + or 00. Returns the cleaned format without normalization.
 */
export function cleanPhoneNumber(phone: string): string {
  // Remove spaces and dashes
  let cleaned = phone.replace(/[\s-]/g, '');
  
  // Return the cleaned format without normalization
  return cleaned;
}

/**
 * Normalizes phone number to E.164-like format (+989xxxxxxxxx)
 */
export function normalizePhoneNumber(phone: string): string {
  const cleaned = cleanPhoneNumber(phone);
  
  if (!PHONE_REGEX.test(cleaned)) {
    throw new Error('Invalid phone number format');
  }
  
  // Normalize to +989 format
  if (cleaned.startsWith('09')) {
    return '+98' + cleaned.slice(1);
  } else if (cleaned.startsWith('00989')) {
    return '+98' + cleaned.slice(4);
  } else if (cleaned.startsWith('+989')) {
    return cleaned;
  }
  
  // This should not happen if PHONE_REGEX passed
  throw new Error('Invalid phone number format');
}

/**
 * Validates and normalizes phone number
 */
export function validateAndNormalizePhone(phone: string): string {
  const cleaned = cleanPhoneNumber(phone);
  
  if (!PHONE_REGEX.test(cleaned)) {
    throw new Error('فرمت شماره موبایل صحیح نیست');
  }
  
  return normalizePhoneNumber(phone);
}
