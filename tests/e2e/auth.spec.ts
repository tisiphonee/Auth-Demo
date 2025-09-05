import { test, expect } from '@playwright/test';

// Mock data for randomuser.me API
const mockUserData = {
  results: [
    {
      name: {
        first: 'John',
        last: 'Doe'
      },
      email: 'john.doe@example.com',
      picture: {
        large: 'https://randomuser.me/api/portraits/men/1.jpg',
        medium: 'https://randomuser.me/api/portraits/med/men/1.jpg',
        thumbnail: 'https://randomuser.me/api/portraits/thumb/men/1.jpg'
      }
    }
  ]
};

test.describe('Authentication Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the randomuser.me API
    await page.route('https://randomuser.me/api/?results=1&nat=us', async route => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockUserData)
      });
    });

    // Clear localStorage before each test
    await page.goto('/login');
    await page.evaluate(() => localStorage.clear());
  });

  test('should complete full authentication flow', async ({ page }) => {
    // Start at login page
    await page.goto('/login');
    await expect(page).toHaveURL('/login');

    // Check page elements
    await expect(page.getByRole('heading', { name: 'ورود' })).toBeVisible();
    await expect(page.getByLabel('شماره موبایل')).toBeVisible();
    await expect(page.getByRole('button', { name: 'ورود' })).toBeVisible();

    // Test phone number validation
    const phoneInput = page.getByLabel('شماره موبایل');
    
    // Test invalid phone number
    await phoneInput.fill('1234567890');
    await page.getByRole('button', { name: 'ورود' }).click();
    await expect(page.getByText('فرمت شماره موبایل صحیح نیست')).toBeVisible();

    // Test valid phone number
    await phoneInput.clear();
    await phoneInput.fill('09123456789');
    await page.getByRole('button', { name: 'ورود' }).click();

    // Should redirect to dashboard (loading state might be too brief to catch)
    await expect(page).toHaveURL('/dashboard');

    // Check dashboard elements
    await expect(page.getByRole('heading', { name: 'داشبورد' })).toBeVisible();
    await expect(page.getByText('خوش آمدید، John Doe!')).toBeVisible();
    await expect(page.getByText('john.doe@example.com').first()).toBeVisible();
    await expect(page.getByText('+989123456789').first()).toBeVisible();
    await expect(page.getByRole('button', { name: 'خروج' })).toBeVisible();

    // Test logout
    await page.getByRole('button', { name: 'خروج' }).click();
    
    // Should redirect back to login
    await expect(page).toHaveURL('/login');
  });

  test('should handle different phone number formats', async ({ page }) => {
    const formats = [
      { input: '09123456789', expected: '+989123456789' },
      { input: '+989123456789', expected: '+989123456789' },
      { input: '00989123456789', expected: '+989123456789' },
      { input: '09 1234 5678 9', expected: '+989123456789' },
      { input: '+98 9 1234 5678 9', expected: '+989123456789' }
    ];

    for (const format of formats) {
      await page.goto('/login');
      await page.getByLabel('شماره موبایل').fill(format.input);
      await page.getByRole('button', { name: 'ورود' }).click();

      // Should redirect to dashboard
      await expect(page).toHaveURL('/dashboard');
      
      // Check that phone is normalized correctly (check the first occurrence in welcome section)
      await expect(page.getByText(format.expected).first()).toBeVisible();

      // Logout for next iteration
      await page.getByRole('button', { name: 'خروج' }).click();
    }
  });

  test('should redirect to login when accessing dashboard without auth', async ({ page }) => {
    // Clear localStorage
    await page.evaluate(() => localStorage.clear());

    // Try to access dashboard directly
    await page.goto('/dashboard');
    
    // Should redirect to login
    await expect(page).toHaveURL('/login');
  });

  test('should handle network errors gracefully', async ({ page }) => {
    // Mock network error
    await page.route('https://randomuser.me/api/?results=1&nat=us', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Internal Server Error' })
      });
    });

    await page.goto('/login');
    await page.getByLabel('شماره موبایل').fill('09123456789');
    await page.getByRole('button', { name: 'ورود' }).click();

    // Should show error message
    await expect(page.getByText('خطا در دریافت اطلاعات کاربر')).toBeVisible();
    
    // Should stay on login page
    await expect(page).toHaveURL('/login');
  });

  test('should persist user data in localStorage', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('شماره موبایل').fill('09123456789');
    await page.getByRole('button', { name: 'ورود' }).click();

    // Wait for redirect
    await expect(page).toHaveURL('/dashboard');

    // Check localStorage
    const userData = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('demo.user') || 'null');
    });

    expect(userData).toBeTruthy();
    expect(userData.name.first).toBe('John');
    expect(userData.name.last).toBe('Doe');
    expect(userData.email).toBe('john.doe@example.com');
    expect(userData.phoneNormalized).toBe('+989123456789');
  });

  test('should clear user data on logout', async ({ page }) => {
    // Login first
    await page.goto('/login');
    await page.getByLabel('شماره موبایل').fill('09123456789');
    await page.getByRole('button', { name: 'ورود' }).click();
    await expect(page).toHaveURL('/dashboard');

    // Check that user data exists
    let userData = await page.evaluate(() => {
      return localStorage.getItem('demo.user');
    });
    expect(userData).toBeTruthy();

    // Logout
    await page.getByRole('button', { name: 'خروج' }).click();
    await expect(page).toHaveURL('/login');

    // Check that user data is cleared
    userData = await page.evaluate(() => {
      return localStorage.getItem('demo.user');
    });
    expect(userData).toBeNull();
  });
});
