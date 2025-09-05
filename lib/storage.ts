import { User, UserSchema, USER_STORAGE_KEY } from './user';

/**
 * Safe localStorage wrapper with error handling
 */
export class StorageManager {
  private static isClient(): boolean {
    return typeof window !== 'undefined';
  }

  /**
   * Get user from localStorage with validation
   */
  static getUser(): User | null {
    if (!this.isClient()) {
      return null;
    }

    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      if (!stored) {
        return null;
      }

      const parsed = JSON.parse(stored);
      const validated = UserSchema.parse(parsed);
      return validated;
    } catch (error) {
      console.error('Failed to parse user from localStorage:', error);
      // Clear invalid data
      this.clearUser();
      return null;
    }
  }

  /**
   * Store user to localStorage with validation
   */
  static setUser(user: User): void {
    if (!this.isClient()) {
      throw new Error('Cannot access localStorage on server');
    }

    try {
      // Validate user data before storing
      const validated = UserSchema.parse(user);
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(validated));
    } catch (error) {
      console.error('Failed to store user to localStorage:', error);
      throw new Error('Failed to save user data');
    }
  }

  /**
   * Clear user from localStorage
   */
  static clearUser(): void {
    if (!this.isClient()) {
      return;
    }

    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (error) {
      console.error('Failed to clear user from localStorage:', error);
    }
  }

  /**
   * Check if user exists in localStorage
   */
  static hasUser(): boolean {
    return this.getUser() !== null;
  }
}
