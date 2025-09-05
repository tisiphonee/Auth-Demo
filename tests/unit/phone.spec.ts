import { describe, it, expect } from 'vitest';
import { 
  cleanPhoneNumber, 
  normalizePhoneNumber, 
  validateAndNormalizePhone,
  PhoneSchema 
} from '@/lib/phone';

describe('Phone Validation and Normalization', () => {
  describe('cleanPhoneNumber', () => {
    it('should clean spaces and dashes from phone numbers', () => {
      expect(cleanPhoneNumber('09 1234 5678')).toBe('0912345678');
      expect(cleanPhoneNumber('09-1234-5678')).toBe('0912345678');
      expect(cleanPhoneNumber('+98 9 1234 5678')).toBe('+98912345678');
      expect(cleanPhoneNumber('0098 9 1234 5678')).toBe('0098912345678');
    });

    it('should handle different prefixes correctly', () => {
      expect(cleanPhoneNumber('09123456789')).toBe('09123456789');
      expect(cleanPhoneNumber('+989123456789')).toBe('+989123456789');
      expect(cleanPhoneNumber('00989123456789')).toBe('00989123456789');
    });
  });

  describe('normalizePhoneNumber', () => {
    it('should normalize 09 format to +989 format', () => {
      expect(normalizePhoneNumber('09123456789')).toBe('+989123456789');
    });

    it('should keep +989 format unchanged', () => {
      expect(normalizePhoneNumber('+989123456789')).toBe('+989123456789');
    });

    it('should normalize 00989 format to +989 format', () => {
      expect(normalizePhoneNumber('00989123456789')).toBe('+989123456789');
    });

    it('should throw error for invalid formats', () => {
      expect(() => normalizePhoneNumber('1234567890')).toThrow('Invalid phone number format');
      expect(() => normalizePhoneNumber('+1234567890')).toThrow('Invalid phone number format');
      expect(() => normalizePhoneNumber('08123456789')).toThrow('Invalid phone number format');
    });
  });

  describe('validateAndNormalizePhone', () => {
    it('should validate and normalize valid phone numbers', () => {
      expect(validateAndNormalizePhone('09123456789')).toBe('+989123456789');
      expect(validateAndNormalizePhone('+989123456789')).toBe('+989123456789');
      expect(validateAndNormalizePhone('00989123456789')).toBe('+989123456789');
      expect(validateAndNormalizePhone('09 1234 5678 9')).toBe('+989123456789');
      expect(validateAndNormalizePhone('+98 9 1234 5678 9')).toBe('+989123456789');
    });

    it('should throw error for invalid phone numbers', () => {
      expect(() => validateAndNormalizePhone('1234567890')).toThrow('فرمت شماره موبایل صحیح نیست');
      expect(() => validateAndNormalizePhone('+1234567890')).toThrow('فرمت شماره موبایل صحیح نیست');
      expect(() => validateAndNormalizePhone('08123456789')).toThrow('فرمت شماره موبایل صحیح نیست');
      expect(() => validateAndNormalizePhone('0912345678')).toThrow('فرمت شماره موبایل صحیح نیست'); // Too short
      expect(() => validateAndNormalizePhone('091234567890')).toThrow('فرمت شماره موبایل صحیح نیست'); // Too long
    });
  });

  describe('PhoneSchema', () => {
    it('should validate valid phone numbers', () => {
      expect(() => PhoneSchema.parse('09123456789')).not.toThrow();
      expect(() => PhoneSchema.parse('+989123456789')).not.toThrow();
      expect(() => PhoneSchema.parse('00989123456789')).not.toThrow();
      expect(() => PhoneSchema.parse('09 1234 5678 9')).not.toThrow();
    });

    it('should reject invalid phone numbers', () => {
      expect(() => PhoneSchema.parse('1234567890')).toThrow();
      expect(() => PhoneSchema.parse('+1234567890')).toThrow();
      expect(() => PhoneSchema.parse('08123456789')).toThrow();
      expect(() => PhoneSchema.parse('0912345678')).toThrow(); // Too short
      expect(() => PhoneSchema.parse('091234567890')).toThrow(); // Too long
      expect(() => PhoneSchema.parse('')).toThrow(); // Empty
    });

    it('should provide proper error messages', () => {
      try {
        PhoneSchema.parse('');
      } catch (error: any) {
        expect(error.errors[0].message).toBe('شماره موبایل الزامی است');
      }

      try {
        PhoneSchema.parse('1234567890');
      } catch (error: any) {
        expect(error.errors[0].message).toBe('فرمت شماره موبایل صحیح نیست');
      }
    });
  });
});
